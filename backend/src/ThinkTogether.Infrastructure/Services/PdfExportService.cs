using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using QRCoder;

namespace ThinkTogether.Infrastructure.Services;

public class PdfExportService : IPdfExportService
{
    private readonly IQuizSetRepository _quizSetRepository;

    public PdfExportService(IQuizSetRepository quizSetRepository)
    {
        _quizSetRepository = quizSetRepository;
        // Configure QuestPDF license (Community License)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]> ExportAttemptReportAsync(
        ChallengeAttemptDto attemptDto,
        string challengeTitle,
        string quizSetTitle,
        CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(GenerateAttemptPdf(attemptDto, challengeTitle, quizSetTitle));
    }

    public async Task<byte[]> ExportLeaderboardAsync(
        ChallengeLeaderboardDto leaderboardDto,
        string challengeTitle,
        CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(GenerateLeaderboardPdf(leaderboardDto, challengeTitle));
    }

    public async Task<byte[]> ExportStatisticsAsync(
        ChallengeStatsDto statsDto,
        string challengeTitle,
        CancellationToken cancellationToken = default)
    {
        return await Task.FromResult(GenerateStatisticsPdf(statsDto, challengeTitle));
    }

    public async Task<byte[]> ExportQuizSetAsync(
        Guid quizSetId,
        CancellationToken cancellationToken = default)
    {
        var quizSet = await _quizSetRepository.GetByIdAsync(quizSetId, cancellationToken);
        if (quizSet == null)
            throw new Exception($"QuizSet with ID {quizSetId} not found.");

        return GenerateQuizSetPdf(quizSet);
    }

    #region PDF Generation Methods

    private static byte[] GenerateAttemptPdf(ChallengeAttemptDto attempt, string challengeTitle, string quizSetTitle)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Column(col =>
                {
                    col.Item().Text("KẾT QUẢ LƯỢT THI").FontSize(24).Bold().FontColor("003366");
                    col.Item().PaddingTop(15).BorderBottom(1).BorderColor("C8C8C8").PaddingBottom(10)
                        .Element(e => e.Text($"Bộ câu hỏi: {quizSetTitle}"));
                    col.Item().PaddingTop(5).Element(e => e.Text($"Thử thách: {challengeTitle}"));
                    col.Item().PaddingTop(5).Element(e => e.Text($"Hoàn thành: {FormatDateTime(attempt.CompletedAt)}"));
                });

                page.Content().Column(col =>
                {
                    col.Item().PaddingTop(20).Text("TÓNG QUAN KẾT QUẢ").FontSize(14).Bold().FontColor("003366");

                    var accuracy = attempt.TotalQuestions > 0
                        ? (float)attempt.CorrectAnswers / attempt.TotalQuestions * 100
                        : 0;

                    col.Item().PaddingTop(10).Row(row =>
                    {
                        row.RelativeItem().Element(e => StatBox(e, "ĐIỂM", 
                            attempt.ScoreAchieved.ToString(), "0066CC"));
                        row.RelativeItem().Element(e => StatBox(e, "CHÍNH XÁC", 
                            $"{accuracy:F1}%", "009944"));
                        row.RelativeItem().Element(e => StatBox(e, "ĐÚNG", 
                            $"{attempt.CorrectAnswers}/{attempt.TotalQuestions}", "FF8000"));
                        row.RelativeItem().Element(e => StatBox(e, "THỜI GIAN", 
                            FormatTimeMs(attempt.CompletionTimeMs), "CC0000"));
                    });

                    col.Item().PaddingTop(20).Text("THÔNG TIN").FontSize(14).Bold().FontColor("003366");
                    col.Item().PaddingTop(10).BorderBottom(1).BorderColor("C8C8C8").PaddingBottom(15)
                        .Element(e => e.Column(c =>
                        {
                            c.Item().Text($"Tên: {attempt.Nickname}");
                            c.Item().PaddingTop(5).Text($"Trạng thái: {FormatAttemptStatus(attempt.Status)}").FontColor(GetStatusColor(attempt.Status));
                            c.Item().PaddingTop(5).Text($"Bắt đầu: {FormatDateTime(attempt.StartedAt)}");
                        }));

                    if (attempt.Questions.Any())
                    {
                        col.Item().PaddingTop(20).Text("CÂU HỎI").FontSize(14).Bold().FontColor("003366");
                        col.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.RelativeColumn(3);
                                c.RelativeColumn();
                            });

                            table.Header(h =>
                            {
                                h.Cell().Background("003366").Padding(6).Text("STT").FontColor("FFFFFF").Bold();
                                h.Cell().Background("003366").Padding(6).Text("Loại").FontColor("FFFFFF").Bold();
                                h.Cell().Background("003366").Padding(6).Text("Tg").FontColor("FFFFFF").Bold();
                            });

                            int idx = 1;
                            foreach (var q in attempt.Questions)
                            {
                                table.Cell().Border(1).BorderColor("DCDCDC").Padding(5).Text(idx.ToString());
                                table.Cell().Border(1).BorderColor("DCDCDC").Padding(5).Text(FormatQuestionType(q.Type));
                                table.Cell().Border(1).BorderColor("DCDCDC").Padding(5).Text(FormatTimeSeconds(q.TimeLimit));
                                idx++;
                            }
                        });
                    }
                });

                page.Footer().AlignCenter().Element(f => f.Text("Trang " + "1" + " | " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm")).FontSize(9).FontColor("666666"));
            });
        }).GeneratePdf();
    }

    private static byte[] GenerateLeaderboardPdf(ChallengeLeaderboardDto leaderboard, string challengeTitle)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Column(col =>
                {
                    col.Item().Text("BẢNG XẾP HẠNG").FontSize(24).Bold().FontColor("003366");
                    col.Item().PaddingTop(10).Text(challengeTitle).FontSize(14).Bold();
                    col.Item().PaddingTop(5).Text($"Tổng: {leaderboard.TotalEntries} lượt").FontSize(10).FontColor("999999");
                    col.Item().PaddingTop(10).BorderBottom(1).BorderColor("C8C8C8").PaddingBottom(10);
                });

                page.Content().Column(col =>
                {
                    if (leaderboard.Entries.Any())
                    {
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn(0.6f);
                                c.RelativeColumn(2.5f);
                                c.RelativeColumn(0.9f);
                                c.RelativeColumn(1f);
                                c.RelativeColumn(0.9f);
                                c.RelativeColumn(1f);
                            });

                            table.Header(h =>
                            {
                                h.Cell().Background("003366").Padding(6).AlignCenter().Text("Rank").FontColor("FFFFFF").Bold().FontSize(9);
                                h.Cell().Background("003366").Padding(6).Text("Tên").FontColor("FFFFFF").Bold().FontSize(9);
                                h.Cell().Background("003366").Padding(6).AlignCenter().Text("Điểm").FontColor("FFFFFF").Bold().FontSize(9);
                                h.Cell().Background("003366").Padding(6).AlignCenter().Text("Đúng").FontColor("FFFFFF").Bold().FontSize(9);
                                h.Cell().Background("003366").Padding(6).AlignCenter().Text("Chính xác").FontColor("FFFFFF").Bold().FontSize(9);
                                h.Cell().Background("003366").Padding(6).AlignCenter().Text("TG").FontColor("FFFFFF").Bold().FontSize(9);
                            });

                            foreach (var entry in leaderboard.Entries)
                            {
                                var bgColor = entry.Rank <= 3 ? "FFFACD" : "FFFFFF";
                                var accuracy = entry.TotalQuestions > 0 ? (float)entry.CorrectAnswers / entry.TotalQuestions * 100 : 0;

                                table.Cell().Background(bgColor).Border(1).BorderColor("DCDCDC").Padding(6).AlignCenter().Text(entry.Rank.ToString()).Bold();
                                table.Cell().Background(bgColor).Border(1).BorderColor("DCDCDC").Padding(6).Text(entry.Nickname).FontSize(10);
                                table.Cell().Background(bgColor).Border(1).BorderColor("DCDCDC").Padding(6).AlignCenter().Text(entry.Score.ToString()).FontColor("0066CC").Bold();
                                table.Cell().Background(bgColor).Border(1).BorderColor("DCDCDC").Padding(6).AlignCenter().Text($"{entry.CorrectAnswers}/{entry.TotalQuestions}");
                                table.Cell().Background(bgColor).Border(1).BorderColor("DCDCDC").Padding(6).AlignCenter().Text($"{accuracy:F1}%");
                                table.Cell().Background(bgColor).Border(1).BorderColor("DCDCDC").Padding(6).AlignCenter().Text(FormatTimeMs(entry.CompletionTimeMs));
                            }
                        });
                    }
                    else
                    {
                        col.Item().PaddingTop(40).AlignCenter().Text("Chưa có dữ liệu").FontSize(14).FontColor("CCCCCC");
                    }
                });

                page.Footer().AlignCenter().Element(f => f.Text("Trang 1 | " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm")).FontSize(9).FontColor("666666"));
            });
        }).GeneratePdf();
    }

    private static byte[] GenerateQuizSetPdf(QuizSet quizSet)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(11));

                // Header and Student Info
                page.Header().Column(col =>
                {
                    // Org Info
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("THINK TOGETHER").FontSize(10).Bold().FontColor("666666");
                            c.Item().Text("ĐỀ THI TRẮC NGHIỆM").FontSize(16).Bold().FontColor("000000");
                        });
                        row.RelativeItem().AlignRight().Column(c =>
                        {
                            c.Item().Text($"Mã đề: {quizSet.DisplayOrder:D3}").FontSize(10); // Dummy code
                            c.Item().Text($"Môn thi: {quizSet.Title}").FontSize(12).Bold();
                        });
                    });

                    col.Item().PaddingTop(10).LineHorizontal(1).LineColor("000000");

                    // Student Info Section
                    col.Item().PaddingTop(10).Row(row =>
                    {
                        row.RelativeItem(2).Column(c =>
                        {
                            c.Item().PaddingBottom(5).Text("Họ và tên: .......................................................................................").FontSize(11);
                            c.Item().PaddingBottom(5).Text("Lớp: ....................................... SBD: ........................................").FontSize(11);
                        });
                        
                        // Score Box
                        row.RelativeItem(1).Border(1).BorderColor("000000").Padding(5).Height(60).Row(r =>
                        {
                           r.RelativeItem().BorderRight(1).BorderColor("000000").Column(c =>
                           {
                               c.Item().AlignCenter().Text("Điểm").FontSize(10).Bold();
                           });
                           r.RelativeItem().Column(c =>
                           {
                               c.Item().AlignCenter().Text("Lời phê").FontSize(10).Bold();
                           });
                        });
                    });

                    // Instructions
                    col.Item().PaddingTop(15).Text(t =>
                    {
                        t.Span("Thời gian làm bài: ").Bold();
                        t.Span($"{CalculateTotalTime(quizSet)} phút");
                        t.Span("     ");
                        t.Span("Số câu hỏi: ").Bold();
                        t.Span($"{quizSet.Questions.Count}");
                    });
                    
                    if (!string.IsNullOrWhiteSpace(quizSet.Description))
                    {
                         col.Item().PaddingTop(5).Text($"Lưu ý: {quizSet.Description}").FontSize(10).Italic();
                    }
                    
                    col.Item().PaddingTop(10).LineHorizontal(2).LineColor("000000");
                });

                // Content
                page.Content().PaddingTop(20).Column(col =>
                {
                    var questions = quizSet.Questions.OrderBy(q => q.DisplayOrder).ToList();
                    for (int i = 0; i < questions.Count; i++)
                    {
                        var question = questions[i];
                        col.Item().PaddingBottom(20).Element(e => RenderQuestion(e, i + 1, question));
                    }

                    // Answer Key Section REMOVED as per user request
                });

                // Footer
                page.Footer().AlignCenter().Element(f => f.Text(text =>
                {
                    text.Span("Trang ");
                    text.CurrentPageNumber();
                    text.Span(" / ");
                    text.TotalPages();
                }));
            });
        }).GeneratePdf();
    }

    private static void RenderQuestion(IContainer container, int index, Question question)
    {
        container.Column(col =>
        {
            // Question Content
            col.Item().Row(row =>
            {
                row.ConstantItem(40).Text($"Câu {index}:").Bold().FontSize(11);
                row.RelativeItem().Text(question.Content).FontSize(11).Medium();
            });

            // Media (QR Code)
            if (question.Type == QuestionType.Video && !string.IsNullOrWhiteSpace(question.VideoUrl))
            {
                col.Item().PaddingTop(5).PaddingLeft(30).Row(row =>
                {
                    var qr = GenerateQrCode(question.VideoUrl);
                    if (qr != null)
                    {
                        row.AutoItem().Width(80).Image(qr);
                        row.RelativeItem().PaddingLeft(10).AlignMiddle().Text(t =>
                        {
                            t.Span("[VIDEO] ").Bold().FontColor("CC0000");
                            t.Span("Quét mã QR để xem video");
                        });
                    }
                });
            }
            else if (question.Type == QuestionType.Audio && !string.IsNullOrWhiteSpace(question.AudioUrl))
            {
                col.Item().PaddingTop(5).PaddingLeft(30).Row(row =>
                {
                    var qr = GenerateQrCode(question.AudioUrl);
                    if (qr != null)
                    {
                        row.AutoItem().Width(80).Image(qr);
                        row.RelativeItem().PaddingLeft(10).AlignMiddle().Text(t =>
                        {
                            t.Span("[AUDIO] ").Bold().FontColor("0066CC");
                            t.Span("Quét mã QR để nghe audio");
                        });
                    }
                });
            }

            // Options
            col.Item().PaddingTop(10).PaddingLeft(30).Column(c =>
            {
                if (question.Type == QuestionType.SingleChoice || question.Type == QuestionType.MultipleChoice || question.Type == QuestionType.TrueFalse)
                {
                    var options = question.Options.OrderBy(o => o.DisplayOrder).ToList();
                    char optionLabel = 'A';
                    foreach (var option in options)
                    {
                        c.Item().PaddingBottom(5).Row(r =>
                        {
                            r.ConstantItem(25).Text($"{optionLabel}.").Bold();
                            r.RelativeItem().Text(option.Content);
                        });
                        optionLabel++;
                    }
                }
                else if (question.Type == QuestionType.Matching)
                {
                    c.Item().Text("Ghép nối các mục ở cột A với cột B:");
                    var pairs = question.MatchingPairs.OrderBy(p => p.DisplayOrder).ToList();
                    c.Item().PaddingTop(5).Table(t =>
                    {
                        t.ColumnsDefinition(cols =>
                        {
                            cols.RelativeColumn();
                            cols.ConstantColumn(20);
                            cols.RelativeColumn();
                        });
                        
                        for(int i=0; i<pairs.Count; i++)
                        {
                             t.Cell().Padding(2).Text($"{i+1}. {pairs[i].LeftContent}");
                             t.Cell().Padding(2).Text("-");
                             t.Cell().Padding(2).Text($"{(char)('A' + i)}. {pairs[i].RightContent}");
                        }
                    });
                }
                else if (question.Type == QuestionType.Ordering)
                {
                     c.Item().Text("Sắp xếp các mục sau theo đúng thứ tự:");
                     var items = question.OrderingItems.OrderBy(o => Guid.NewGuid()).ToList(); // Shuffle for display? Or just list them? usually exam paper scrambles them.
                     // But here I don't have a shuffle mechanism easily. I'll just list them as stored but maybe they are stored in correct order?
                     // OrderingItems has CorrectPosition. I should probably shuffle them or at least show them unsorted if possible.
                     // For now, listing them by DisplayOrder or random.
                     // Let's just list them.
                     
                     foreach (var item in items)
                     {
                         c.Item().PaddingBottom(2).Row(r =>
                         {
                             r.ConstantItem(20).Text("-");
                             r.RelativeItem().Text(item.Content);
                         });
                     }
                }
            });
        });
    }

    private static string CalculateTotalTime(QuizSet quizSet)
    {
        var totalSeconds = quizSet.Questions.Sum(q => q.TimeLimit);
        return Math.Ceiling(totalSeconds / 60.0).ToString();
    }

    private static string GetAnswerKey(Question q)
    {
        if (q.Type == QuestionType.SingleChoice || q.Type == QuestionType.MultipleChoice || q.Type == QuestionType.TrueFalse)
        {
            var correctOptions = q.Options.OrderBy(o => o.DisplayOrder)
                .Select((o, idx) => new { Option = o, Index = idx })
                .Where(x => x.Option.IsCorrect)
                .Select(x => (char)('A' + x.Index))
                .ToList();
            return string.Join(", ", correctOptions);
        }
        else if (q.Type == QuestionType.Matching)
        {
            // For matching, usually 1-A, 2-B etc.
            // But here I need to match LeftContent to RightContent.
            // The pairing is stored in MatchingPair.
            return "Xem nội dung ghép cặp"; // Simplified for now
        }
        else if (q.Type == QuestionType.Ordering)
        {
             var sorted = q.OrderingItems.OrderBy(i => i.CorrectPosition).Select(i => i.Content);
             return string.Join(" -> ", sorted);
        }
        return "";
    }

    private static byte[]? GenerateQrCode(string url)
    {
        try 
        {
            using var generator = new QRCodeGenerator();
            using var data = generator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
            using var qr = new PngByteQRCode(data);
            return qr.GetGraphic(20);
        }
        catch
        {
            return null;
        }
    }

    private static byte[] GenerateStatisticsPdf(ChallengeStatsDto stats, string challengeTitle)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Column(col =>
                {
                    col.Item().Text("THỐNG KÊ THỬ THÁCH").FontSize(24).Bold().FontColor("003366");
                    col.Item().PaddingTop(10).Text(challengeTitle).FontSize(14).Bold();
                    col.Item().PaddingTop(5).Text($"Cập nhật: {DateTime.UtcNow:dd/MM/yyyy HH:mm}").FontSize(10).FontColor("999999");
                    col.Item().PaddingTop(10).BorderBottom(1).BorderColor("C8C8C8").PaddingBottom(10);
                });

                page.Content().Column(col =>
                {
                    // === CHI TIẾT TOÀN DIỆN ===
                    col.Item().PaddingTop(25).Text("CHI TIẾT TOÀN DIỆN").FontSize(13).Bold().FontColor("003366");
                    col.Item().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(2.5f);
                            c.RelativeColumn(1.5f);
                        });

                        // Phần Tham Gia
                        table.Cell().Background("E8F4F8").Padding(8).Text("THÔNG TIN THAM GIA").Bold().FontSize(10).FontColor("003366");
                        table.Cell().Background("E8F4F8").Padding(8).Text("");
                        
                        StatRow(table, "Tổng lượt chơi", stats.TotalAttempts.ToString());
                        StatRow(table, "Lượt hoàn thành", stats.CompletedAttempts.ToString());
                        StatRow(table, "Lượt chưa hoàn thành", (stats.TotalAttempts - stats.CompletedAttempts).ToString());
                        StatRow(table, "Tỷ lệ hoàn thành", $"{stats.CompletionRate:F1}%");
                        StatRow(table, "Tổng người tham gia", stats.TotalParticipants.ToString());
                        
                        // Phần Điểm
                        table.Cell().Background("E8F0F8").Padding(8).BorderTop(1).BorderColor("C8C8C8")
                            .Text("THỐNG KÊ ĐIỂM").Bold().FontSize(10).FontColor("003366");
                        table.Cell().Background("E8F0F8").Padding(8).BorderTop(1).BorderColor("C8C8C8").Text("");
                        
                        StatRow(table, "Điểm trung bình", $"{stats.AverageScore:F2}");
                        StatRow(table, "Điểm cao nhất", stats.TopScore.ToString());
                        StatRow(table, "Tỷ lệ chính xác trung bình", $"{stats.AverageAccuracy:F1}%");
                    });
                });

                page.Footer().AlignCenter().Element(f => f.Text("Trang 1 | " + DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm")).FontSize(9).FontColor("666666"));
            });
        }).GeneratePdf();
    }

    #endregion

    #region Helper Methods

    private static void StatBox(IContainer element, string label, string value, string color)
    {
        element.Border(2).BorderColor(color).Background("F5F5F5").Padding(12)
            .Column(c =>
            {
                c.Item().Text(label).FontSize(9).Bold().FontColor(color);
                c.Item().PaddingTop(6).Text(value).FontSize(14).Bold().FontColor(color);
            });
    }

    private static void StatRow(TableDescriptor table, string label, string value)
    {
        table.Cell().Padding(8).BorderBottom(1).BorderColor("DCDCDC").Text(label).Bold();
        table.Cell().Padding(8).BorderBottom(1).BorderColor("DCDCDC").Text(value).AlignRight();
    }

    private static string FormatDateTime(DateTime dt) => dt.ToString("dd/MM/yyyy HH:mm");

    private static string FormatTimeMs(int? ms)
    {
        if (!ms.HasValue || ms <= 0) return "—";
        var totalSecs = ms.Value / 1000;
        var mins = totalSecs / 60;
        var secs = totalSecs % 60;
        return $"{mins}m {secs}s";
    }

    private static string FormatTimeSeconds(int secs)
    {
        if (secs <= 0) return "—";
        if (secs < 60) return $"{secs}s";
        var mins = secs / 60;
        var s = secs % 60;
        return s > 0 ? $"{mins}m {s}s" : $"{mins}m";
    }

    private static string FormatQuestionType(QuestionType type) => type switch
    {
        QuestionType.SingleChoice => "Chọn 1",
        QuestionType.TrueFalse => "Đúng/Sai",
        QuestionType.MultipleChoice => "Chọn nhiều",
        QuestionType.Matching => "Ghép cặp",
        QuestionType.Ordering => "Sắp xếp",
        QuestionType.Video => "Video",
        QuestionType.Audio => "Audio",
        _ => "Khác"
    };

    private static string FormatAttemptStatus(AttemptStatus status) => status switch
    {
        AttemptStatus.Completed => "Hoàn thành",
        AttemptStatus.InProgress => "Đang làm",
        AttemptStatus.Abandoned => "Bỏ dở",
        _ => "?"
    };

    private static string GetStatusColor(AttemptStatus status) => status switch
    {
        AttemptStatus.Completed => "009944",
        AttemptStatus.InProgress => "FF8000",
        AttemptStatus.Abandoned => "CC0000",
        _ => "999999"
    };

    #endregion
}
