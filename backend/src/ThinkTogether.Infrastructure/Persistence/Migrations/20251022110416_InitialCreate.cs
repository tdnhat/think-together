using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ThinkTogether.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BoLocTuMieng",
                columns: table => new
                {
                    idBoLoc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    pattern = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    mucDoNghiemTrong = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    dangHoatDong = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoLocTuMieng", x => x.idBoLoc);
                });

            migrationBuilder.CreateTable(
                name: "BoTrucNghiem",
                columns: table => new
                {
                    idBoTrucNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tieuDe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    urlAnhBia = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    daDangTai = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    thuTu = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoTrucNghiem", x => x.idBoTrucNghiem);
                });

            migrationBuilder.CreateTable(
                name: "CauHoiPhienChoi",
                columns: table => new
                {
                    idCauHoiPhien = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    viTriTrongPhien = table.Column<int>(type: "int", nullable: false),
                    soTraLoiDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    soTraLoiSai = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianTraLoiTrungBinh = table.Column<double>(type: "float", nullable: false, defaultValue: 0.0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoiPhienChoi", x => x.idCauHoiPhien);
                });

            migrationBuilder.CreateTable(
                name: "CauTraLoiThachThuc",
                columns: table => new
                {
                    idCauTraLoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idLuotChoiThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    cauTraLoi = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    thoiGianNop = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    dung = table.Column<bool>(type: "bit", nullable: false),
                    diemDat = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauTraLoiThachThuc", x => x.idCauTraLoi);
                });

            migrationBuilder.CreateTable(
                name: "DiemPhienChoi",
                columns: table => new
                {
                    idDiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tongDiem = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    xepHangCuoi = table.Column<int>(type: "int", nullable: false),
                    soCauDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    tongSoCau = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    tiLeChinhXac = table.Column<double>(type: "float", nullable: false, defaultValue: 0.0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiemPhienChoi", x => x.idDiem);
                });

            migrationBuilder.CreateTable(
                name: "Media",
                columns: table => new
                {
                    idMedia = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiTaiLen = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tenFile = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    loai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    loaiMime = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    kichThuocByte = table.Column<int>(type: "int", nullable: false),
                    thoiLuongGiay = table.Column<int>(type: "int", nullable: true),
                    ngayTaiLen = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Media", x => x.idMedia);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    matKhau = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    tenDem = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    tenGoi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    vaiTro = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    urlAnhDaiDien = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    gioiThieu = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDung", x => x.idNguoiDung);
                });

            migrationBuilder.CreateTable(
                name: "NhatKyHeThong",
                columns: table => new
                {
                    idNhatKy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiThayDoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    loaiThucThe = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    idThucThe = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    hanhDong = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    giaTriCu = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    giaTriMoi = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    diaChiIP = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true),
                    thoiGianThayDoi = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhatKyHeThong", x => x.idNhatKy);
                });

            migrationBuilder.CreateTable(
                name: "NhatKyQuanTri",
                columns: table => new
                {
                    idNhatKy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idQuanTri = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    hanhDong = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    loaiThucThe = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    idThucThe = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    lyDo = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    daGiaiQuyet = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ngayGiaiQuyet = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhatKyQuanTri", x => x.idNhatKy);
                });

            migrationBuilder.CreateTable(
                name: "PhienChoi",
                columns: table => new
                {
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idChuPhong = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBoTrucNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    maPIN = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    cauHoiHienTai = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianBatDau = table.Column<DateTime>(type: "datetime2", nullable: true),
                    thoiGianKetThuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhienChoi", x => x.idPhienChoi);
                });

            migrationBuilder.CreateTable(
                name: "ThachThuc",
                columns: table => new
                {
                    idThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiTao = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBoTrucNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tieuDe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    urlChiaSeLink = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    hienThiBangXepHang = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    luotChoi = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThachThuc", x => x.idThachThuc);
                });

            migrationBuilder.CreateTable(
                name: "ThongKeCauHoi",
                columns: table => new
                {
                    idThongKe = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    soTraLoiDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    soTraLoiSai = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianTraLoiTrungBinh = table.Column<double>(type: "float", nullable: false, defaultValue: 0.0),
                    tiLeKho = table.Column<double>(type: "float", nullable: false, defaultValue: 0.0),
                    cauTraLoiDuocChonNhieu = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongKeCauHoi", x => x.idThongKe);
                });

            migrationBuilder.CreateTable(
                name: "CauHoi",
                columns: table => new
                {
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuizSetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    noiDung = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: false),
                    loaiCauHoi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    giuiHanThoiGian = table.Column<int>(type: "int", nullable: false, defaultValue: 30),
                    thuTu = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Explanation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoi", x => x.idCauHoi);
                    table.ForeignKey(
                        name: "FK_CauHoi_BoTrucNghiem_QuizSetId",
                        column: x => x.QuizSetId,
                        principalTable: "BoTrucNghiem",
                        principalColumn: "idBoTrucNghiem",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CaiDatPhienChoi",
                columns: table => new
                {
                    idCaiDat = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    xaoTronCauHoi = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    xaoTronCauTraLoi = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    hienThiBangXepHang = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    hienThiDapAnDung = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaiDatPhienChoi", x => x.idCaiDat);
                    table.ForeignKey(
                        name: "FK_CaiDatPhienChoi_PhienChoi_idPhienChoi",
                        column: x => x.idPhienChoi,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CauTraLoiNguoiChoi",
                columns: table => new
                {
                    idCauTraLoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    noiDungTraLoi = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    dung = table.Column<bool>(type: "bit", nullable: false),
                    diemDat = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TimeToAnswer = table.Column<int>(type: "int", nullable: false),
                    GameSessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauTraLoiNguoiChoi", x => x.idCauTraLoi);
                    table.ForeignKey(
                        name: "FK_CauTraLoiNguoiChoi_PhienChoi_GameSessionId",
                        column: x => x.GameSessionId,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi");
                });

            migrationBuilder.CreateTable(
                name: "NguoiChoiPhien",
                columns: table => new
                {
                    idNguoiChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    thamDuOi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    diem = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    xepHang = table.Column<int>(type: "int", nullable: false),
                    trangThaiKetNoi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiChoiPhien", x => x.idNguoiChoi);
                    table.ForeignKey(
                        name: "FK_NguoiChoiPhien_PhienChoi_idPhienChoi",
                        column: x => x.idPhienChoi,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BangXepHangThachThuc",
                columns: table => new
                {
                    idBangXepHang = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tenHocSinh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    diemCaoNhat = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    xepHang = table.Column<int>(type: "int", nullable: false),
                    thoiGianDatDiem = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BangXepHangThachThuc", x => x.idBangXepHang);
                    table.ForeignKey(
                        name: "FK_BangXepHangThachThuc_ThachThuc_idThachThuc",
                        column: x => x.idThachThuc,
                        principalTable: "ThachThuc",
                        principalColumn: "idThachThuc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LuotChoiThachThuc",
                columns: table => new
                {
                    idLuotChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tenHocSinh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    diemDat = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianHoanThanh = table.Column<int>(type: "int", nullable: false),
                    soCauDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianHoanTatLuot = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LuotChoiThachThuc", x => x.idLuotChoi);
                    table.ForeignKey(
                        name: "FK_LuotChoiThachThuc_ThachThuc_idThachThuc",
                        column: x => x.idThachThuc,
                        principalTable: "ThachThuc",
                        principalColumn: "idThachThuc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CapGhep",
                columns: table => new
                {
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    noiDungTrai = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: false),
                    noiDungPhai = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: false),
                    thuTu = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CapGhep", x => new { x.idCauHoi, x.Id });
                    table.ForeignKey(
                        name: "FK_CapGhep_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CauTraLoi",
                columns: table => new
                {
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    noiDung = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: false),
                    laDapAnDung = table.Column<bool>(type: "bit", nullable: false),
                    thuTu = table.Column<int>(type: "int", nullable: false),
                    urlAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauTraLoi", x => new { x.idCauHoi, x.Id });
                    table.ForeignKey(
                        name: "FK_CauTraLoi_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MucSapXep",
                columns: table => new
                {
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    noiDung = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: false),
                    viTriDung = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MucSapXep", x => new { x.idCauHoi, x.Id });
                    table.ForeignKey(
                        name: "FK_MucSapXep_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BangXepHangThachThuc_idThachThuc",
                table: "BangXepHangThachThuc",
                column: "idThachThuc");

            migrationBuilder.CreateIndex(
                name: "IX_BangXepHangThachThuc_idThachThuc_xepHang",
                table: "BangXepHangThachThuc",
                columns: new[] { "idThachThuc", "xepHang" });

            migrationBuilder.CreateIndex(
                name: "IX_BangXepHangThachThuc_ngayXoa",
                table: "BangXepHangThachThuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_BoLocTuMieng_dangHoatDong",
                table: "BoLocTuMieng",
                column: "dangHoatDong");

            migrationBuilder.CreateIndex(
                name: "IX_BoLocTuMieng_mucDoNghiemTrong",
                table: "BoLocTuMieng",
                column: "mucDoNghiemTrong");

            migrationBuilder.CreateIndex(
                name: "IX_BoLocTuMieng_pattern",
                table: "BoLocTuMieng",
                column: "pattern",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BoTrucNghiem_daDangTai",
                table: "BoTrucNghiem",
                column: "daDangTai");

            migrationBuilder.CreateIndex(
                name: "IX_BoTrucNghiem_idNguoiDung",
                table: "BoTrucNghiem",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_BoTrucNghiem_ngayXoa",
                table: "BoTrucNghiem",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CaiDatPhienChoi_idPhienChoi",
                table: "CaiDatPhienChoi",
                column: "idPhienChoi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CaiDatPhienChoi_ngayXoa",
                table: "CaiDatPhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_ngayXoa",
                table: "CauHoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_QuizSetId",
                table: "CauHoi",
                column: "QuizSetId");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_thuTu",
                table: "CauHoi",
                column: "thuTu");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiPhienChoi_idCauHoi",
                table: "CauHoiPhienChoi",
                column: "idCauHoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiPhienChoi_idPhienChoi",
                table: "CauHoiPhienChoi",
                column: "idPhienChoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiPhienChoi_idPhienChoi_viTriTrongPhien",
                table: "CauHoiPhienChoi",
                columns: new[] { "idPhienChoi", "viTriTrongPhien" });

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiPhienChoi_ngayXoa",
                table: "CauHoiPhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiNguoiChoi_GameSessionId",
                table: "CauTraLoiNguoiChoi",
                column: "GameSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiNguoiChoi_idCauHoi",
                table: "CauTraLoiNguoiChoi",
                column: "idCauHoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiNguoiChoi_idNguoiChoi",
                table: "CauTraLoiNguoiChoi",
                column: "idNguoiChoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiNguoiChoi_ngayXoa",
                table: "CauTraLoiNguoiChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiThachThuc_idCauHoi",
                table: "CauTraLoiThachThuc",
                column: "idCauHoi");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiThachThuc_idLuotChoiThachThuc",
                table: "CauTraLoiThachThuc",
                column: "idLuotChoiThachThuc");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiThachThuc_idLuotChoiThachThuc_idCauHoi",
                table: "CauTraLoiThachThuc",
                columns: new[] { "idLuotChoiThachThuc", "idCauHoi" });

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiThachThuc_ngayXoa",
                table: "CauTraLoiThachThuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_idNguoiChoi",
                table: "DiemPhienChoi",
                column: "idNguoiChoi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_idPhienChoi",
                table: "DiemPhienChoi",
                column: "idPhienChoi");

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_idPhienChoi_xepHangCuoi",
                table: "DiemPhienChoi",
                columns: new[] { "idPhienChoi", "xepHangCuoi" });

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_ngayXoa",
                table: "DiemPhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_tongDiem",
                table: "DiemPhienChoi",
                column: "tongDiem",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_idThachThuc",
                table: "LuotChoiThachThuc",
                column: "idThachThuc");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_ngayXoa",
                table: "LuotChoiThachThuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_tenHocSinh",
                table: "LuotChoiThachThuc",
                column: "tenHocSinh");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_thoiGianHoanTatLuot",
                table: "LuotChoiThachThuc",
                column: "thoiGianHoanTatLuot");

            migrationBuilder.CreateIndex(
                name: "IX_Media_idNguoiTaiLen",
                table: "Media",
                column: "idNguoiTaiLen");

            migrationBuilder.CreateIndex(
                name: "IX_Media_loai",
                table: "Media",
                column: "loai");

            migrationBuilder.CreateIndex(
                name: "IX_Media_ngayTaiLen",
                table: "Media",
                column: "ngayTaiLen");

            migrationBuilder.CreateIndex(
                name: "IX_Media_ngayXoa",
                table: "Media",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_idPhienChoi",
                table: "NguoiChoiPhien",
                column: "idPhienChoi");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_ngayXoa",
                table: "NguoiChoiPhien",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_xepHang",
                table: "NguoiChoiPhien",
                column: "xepHang");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_email",
                table: "NguoiDung",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_ngayXoa",
                table: "NguoiDung",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_vaiTro",
                table: "NguoiDung",
                column: "vaiTro");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHeThong_hanhDong",
                table: "NhatKyHeThong",
                column: "hanhDong");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHeThong_idNguoiThayDoi",
                table: "NhatKyHeThong",
                column: "idNguoiThayDoi");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHeThong_idThucThe",
                table: "NhatKyHeThong",
                column: "idThucThe");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHeThong_loaiThucThe",
                table: "NhatKyHeThong",
                column: "loaiThucThe");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHeThong_thoiGianThayDoi",
                table: "NhatKyHeThong",
                column: "thoiGianThayDoi");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_daGiaiQuyet",
                table: "NhatKyQuanTri",
                column: "daGiaiQuyet");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_hanhDong",
                table: "NhatKyQuanTri",
                column: "hanhDong");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_idQuanTri",
                table: "NhatKyQuanTri",
                column: "idQuanTri");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_idThucThe",
                table: "NhatKyQuanTri",
                column: "idThucThe");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_loaiThucThe",
                table: "NhatKyQuanTri",
                column: "loaiThucThe");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_ngayGiaiQuyet",
                table: "NhatKyQuanTri",
                column: "ngayGiaiQuyet");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyQuanTri_ngayTao",
                table: "NhatKyQuanTri",
                column: "ngayTao");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_idBoTrucNghiem",
                table: "PhienChoi",
                column: "idBoTrucNghiem");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_idChuPhong",
                table: "PhienChoi",
                column: "idChuPhong");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_ngayXoa",
                table: "PhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_trangThai",
                table: "PhienChoi",
                column: "trangThai");

            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_idBoTrucNghiem",
                table: "ThachThuc",
                column: "idBoTrucNghiem");

            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_idNguoiTao",
                table: "ThachThuc",
                column: "idNguoiTao");

            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_ngayXoa",
                table: "ThachThuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_trangThai",
                table: "ThachThuc",
                column: "trangThai");

            migrationBuilder.CreateIndex(
                name: "IX_ThongKeCauHoi_idCauHoi",
                table: "ThongKeCauHoi",
                column: "idCauHoi");

            migrationBuilder.CreateIndex(
                name: "IX_ThongKeCauHoi_idPhienChoi",
                table: "ThongKeCauHoi",
                column: "idPhienChoi");

            migrationBuilder.CreateIndex(
                name: "IX_ThongKeCauHoi_idPhienChoi_idCauHoi",
                table: "ThongKeCauHoi",
                columns: new[] { "idPhienChoi", "idCauHoi" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ThongKeCauHoi_ngayXoa",
                table: "ThongKeCauHoi",
                column: "ngayXoa");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BangXepHangThachThuc");

            migrationBuilder.DropTable(
                name: "BoLocTuMieng");

            migrationBuilder.DropTable(
                name: "CaiDatPhienChoi");

            migrationBuilder.DropTable(
                name: "CapGhep");

            migrationBuilder.DropTable(
                name: "CauHoiPhienChoi");

            migrationBuilder.DropTable(
                name: "CauTraLoi");

            migrationBuilder.DropTable(
                name: "CauTraLoiNguoiChoi");

            migrationBuilder.DropTable(
                name: "CauTraLoiThachThuc");

            migrationBuilder.DropTable(
                name: "DiemPhienChoi");

            migrationBuilder.DropTable(
                name: "LuotChoiThachThuc");

            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.DropTable(
                name: "MucSapXep");

            migrationBuilder.DropTable(
                name: "NguoiChoiPhien");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "NhatKyHeThong");

            migrationBuilder.DropTable(
                name: "NhatKyQuanTri");

            migrationBuilder.DropTable(
                name: "ThongKeCauHoi");

            migrationBuilder.DropTable(
                name: "ThachThuc");

            migrationBuilder.DropTable(
                name: "CauHoi");

            migrationBuilder.DropTable(
                name: "PhienChoi");

            migrationBuilder.DropTable(
                name: "BoTrucNghiem");
        }
    }
}
