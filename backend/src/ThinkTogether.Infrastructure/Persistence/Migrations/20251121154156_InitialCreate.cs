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
                name: "ThongKeCauHoi",
                columns: table => new
                {
                    idThongKe = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    soLanHoi = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    soLanTraLoiDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    soLanTraLoiSai = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianTrungBinhMs = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    doDung = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongKeCauHoi", x => x.idThongKe);
                    table.CheckConstraint("CK_ThongKeCauHoi_doDung", "doDung >= 0 AND doDung <= 100");
                    table.CheckConstraint("CK_ThongKeCauHoi_soLanHoi", "soLanHoi >= 0");
                    table.CheckConstraint("CK_ThongKeCauHoi_soLanTraLoiDung", "soLanTraLoiDung >= 0");
                    table.CheckConstraint("CK_ThongKeCauHoi_soLanTraLoiSai", "soLanTraLoiSai >= 0");
                    table.CheckConstraint("CK_ThongKeCauHoi_thoiGianTrungBinhMs", "thoiGianTrungBinhMs >= 0");
                });

            migrationBuilder.CreateTable(
                name: "VaiTro",
                columns: table => new
                {
                    idVaiTro = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tenVaiTro = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTro", x => x.idVaiTro);
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
                    idVaiTro = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    urlAnhDaiDien = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    gioiThieu = table.Column<string>(type: "nvarchar(max)", maxLength: -1, nullable: true),
                    daXacNhanEmail = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDung", x => x.idNguoiDung);
                    table.ForeignKey(
                        name: "FK_NguoiDung_VaiTro_RoleId1",
                        column: x => x.RoleId1,
                        principalTable: "VaiTro",
                        principalColumn: "idVaiTro");
                    table.ForeignKey(
                        name: "FK_NguoiDung_VaiTro_idVaiTro",
                        column: x => x.idVaiTro,
                        principalTable: "VaiTro",
                        principalColumn: "idVaiTro",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BoTracNghiem",
                columns: table => new
                {
                    idBoTracNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tieuDe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    urlAnhBia = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    daDangTai = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    thuTu = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoTracNghiem", x => x.idBoTracNghiem);
                    table.ForeignKey(
                        name: "FK_BoTracNghiem_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LopHoc",
                columns: table => new
                {
                    idLopHoc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idGiaoVien = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tenLop = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    maLop = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    urlAnhBia = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LopHoc", x => x.idLopHoc);
                    table.CheckConstraint("CK_LopHoc_maLop", "LEN(maLop) = 8");
                    table.ForeignKey(
                        name: "FK_LopHoc_NguoiDung_idGiaoVien",
                        column: x => x.idGiaoVien,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MaLamMoi",
                columns: table => new
                {
                    idMaLamMoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    maToken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    hetHanLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    thuHoiLuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    taoLuc = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    capNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaLamMoi", x => x.idMaLamMoi);
                    table.ForeignKey(
                        name: "FK_MaLamMoi_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MaNguoiDung",
                columns: table => new
                {
                    idMaNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    loaiToken = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    maToken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    hetHanLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    suDungLuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    taoLuc = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    capNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaNguoiDung", x => x.idMaNguoiDung);
                    table.CheckConstraint("CK_MaNguoiDung_loaiToken", "loaiToken IN ('PASSWORD_RESET', 'EMAIL_CONFIRMATION')");
                    table.ForeignKey(
                        name: "FK_MaNguoiDung_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CauHoi",
                columns: table => new
                {
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBoTracNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    noiDung = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    loaiCauHoi = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    giuiHanThoiGian = table.Column<int>(type: "int", nullable: false, defaultValue: 30),
                    thuTu = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    QuizSetId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoi", x => x.idCauHoi);
                    table.CheckConstraint("CK_CauHoi_giuiHanThoiGian", "giuiHanThoiGian > 0 AND giuiHanThoiGian <= 300");
                    table.CheckConstraint("CK_CauHoi_loaiCauHoi", "loaiCauHoi IN ('SingleChoice', 'TrueFalse', 'MultipleChoice', 'Matching', 'Ordering', 'Video')");
                    table.CheckConstraint("CK_CauHoi_thuTu", "thuTu >= 0");
                    table.ForeignKey(
                        name: "FK_CauHoi_BoTracNghiem_QuizSetId1",
                        column: x => x.QuizSetId1,
                        principalTable: "BoTracNghiem",
                        principalColumn: "idBoTracNghiem");
                    table.ForeignKey(
                        name: "FK_CauHoi_BoTracNghiem_idBoTracNghiem",
                        column: x => x.idBoTracNghiem,
                        principalTable: "BoTracNghiem",
                        principalColumn: "idBoTracNghiem",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhienChoi",
                columns: table => new
                {
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idChuPhong = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBoTracNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    maPIN = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
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
                    table.CheckConstraint("CK_PhienChoi_cauHoiHienTai", "cauHoiHienTai >= 0");
                    table.CheckConstraint("CK_PhienChoi_maPIN", "LEN(maPIN) = 6 AND maPIN LIKE '[0-9][0-9][0-9][0-9][0-9][0-9]'");
                    table.CheckConstraint("CK_PhienChoi_thoiGian", "thoiGianKetThuc IS NULL OR thoiGianKetThuc >= thoiGianBatDau");
                    table.CheckConstraint("CK_PhienChoi_trangThai", "trangThai IN ('Waiting', 'Started', 'Ended')");
                    table.ForeignKey(
                        name: "FK_PhienChoi_BoTracNghiem_idBoTracNghiem",
                        column: x => x.idBoTracNghiem,
                        principalTable: "BoTracNghiem",
                        principalColumn: "idBoTracNghiem",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PhienChoi_NguoiDung_idChuPhong",
                        column: x => x.idChuPhong,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ThachThuc",
                columns: table => new
                {
                    idThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiTao = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBoTracNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tieuDe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    urlChiaSe = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    hienThiBangXepHang = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    luotChoi = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThachThuc", x => x.idThachThuc);
                    table.CheckConstraint("CK_ThachThuc_luotChoi", "luotChoi >= 0");
                    table.CheckConstraint("CK_ThachThuc_trangThai", "trangThai IN ('Active', 'Archived')");
                    table.ForeignKey(
                        name: "FK_ThachThuc_BoTracNghiem_idBoTracNghiem",
                        column: x => x.idBoTracNghiem,
                        principalTable: "BoTracNghiem",
                        principalColumn: "idBoTracNghiem",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThachThuc_NguoiDung_idNguoiTao",
                        column: x => x.idNguoiTao,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BaiTapVeNha",
                columns: table => new
                {
                    idBaiTapVeNha = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idLopHoc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBoTracNghiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tieuDe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    hanChot = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ngayGiao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ClassId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaiTapVeNha", x => x.idBaiTapVeNha);
                    table.CheckConstraint("CK_BaiTapVeNha_hanChot", "hanChot IS NULL OR hanChot >= ngayGiao");
                    table.ForeignKey(
                        name: "FK_BaiTapVeNha_BoTracNghiem_idBoTracNghiem",
                        column: x => x.idBoTracNghiem,
                        principalTable: "BoTracNghiem",
                        principalColumn: "idBoTracNghiem",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BaiTapVeNha_LopHoc_ClassId1",
                        column: x => x.ClassId1,
                        principalTable: "LopHoc",
                        principalColumn: "idLopHoc");
                    table.ForeignKey(
                        name: "FK_BaiTapVeNha_LopHoc_idLopHoc",
                        column: x => x.idLopHoc,
                        principalTable: "LopHoc",
                        principalColumn: "idLopHoc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThanhVienLop",
                columns: table => new
                {
                    idThanhVien = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idLopHoc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ngayThamGia = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayRoi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ClassId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThanhVienLop", x => x.idThanhVien);
                    table.ForeignKey(
                        name: "FK_ThanhVienLop_LopHoc_ClassId1",
                        column: x => x.ClassId1,
                        principalTable: "LopHoc",
                        principalColumn: "idLopHoc");
                    table.ForeignKey(
                        name: "FK_ThanhVienLop_LopHoc_idLopHoc",
                        column: x => x.idLopHoc,
                        principalTable: "LopHoc",
                        principalColumn: "idLopHoc",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThanhVienLop_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CauHoi_TracNghiem",
                columns: table => new
                {
                    noiDung = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    thuTu = table.Column<int>(type: "int", nullable: false),
                    laDapAnDung = table.Column<bool>(type: "bit", nullable: false),
                    urlAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoi_TracNghiem", x => new { x.noiDung, x.thuTu });
                    table.CheckConstraint("CK_CauHoi_TracNghiem_thuTu", "thuTu >= 0");
                    table.ForeignKey(
                        name: "FK_CauHoi_TracNghiem_CauHoi_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi");
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
                name: "CauHoiPhienChoi",
                columns: table => new
                {
                    idCauHoiPhien = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    viTriTrongPhien = table.Column<int>(type: "int", nullable: false),
                    soTraLoiDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    soTraLoiSai = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianTraLoiTrungBinh = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false, defaultValue: 0m),
                    GameSessionId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHoiPhienChoi", x => x.idCauHoiPhien);
                    table.CheckConstraint("CK_CauHoiPhienChoi_soTraLoiDung", "soTraLoiDung >= 0");
                    table.CheckConstraint("CK_CauHoiPhienChoi_soTraLoiSai", "soTraLoiSai >= 0");
                    table.CheckConstraint("CK_CauHoiPhienChoi_thoiGian", "thoiGianTraLoiTrungBinh >= 0");
                    table.CheckConstraint("CK_CauHoiPhienChoi_viTriTrongPhien", "viTriTrongPhien >= 0");
                    table.ForeignKey(
                        name: "FK_CauHoiPhienChoi_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CauHoiPhienChoi_PhienChoi_GameSessionId1",
                        column: x => x.GameSessionId1,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi");
                    table.ForeignKey(
                        name: "FK_CauHoiPhienChoi_PhienChoi_idPhienChoi",
                        column: x => x.idPhienChoi,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NguoiChoiPhien",
                columns: table => new
                {
                    idNguoiChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    bietDanh = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    trangThaiKetNoi = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    GameSessionId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiChoiPhien", x => x.idNguoiChoi);
                    table.CheckConstraint("CK_NguoiChoiPhien_bietDanh", "LEN(bietDanh) >= 2 AND LEN(bietDanh) <= 100");
                    table.CheckConstraint("CK_NguoiChoiPhien_trangThaiKetNoi", "trangThaiKetNoi IN ('Connected', 'Disconnected')");
                    table.ForeignKey(
                        name: "FK_NguoiChoiPhien_PhienChoi_GameSessionId1",
                        column: x => x.GameSessionId1,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi");
                    table.ForeignKey(
                        name: "FK_NguoiChoiPhien_PhienChoi_idPhienChoi",
                        column: x => x.idPhienChoi,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LuotChoiThachThuc",
                columns: table => new
                {
                    idLuotChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    bietDanh = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    diemDat = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    soCauDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    tongSoCau = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianHoanThanhMs = table.Column<int>(type: "int", nullable: true),
                    thoiGianHoanTatLuot = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ChallengeId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LuotChoiThachThuc", x => x.idLuotChoi);
                    table.CheckConstraint("CK_LuotChoiThachThuc_diemDat", "diemDat >= 0");
                    table.CheckConstraint("CK_LuotChoiThachThuc_soCauDung", "soCauDung >= 0 AND soCauDung <= tongSoCau");
                    table.CheckConstraint("CK_LuotChoiThachThuc_thoiGian", "thoiGianHoanThanhMs IS NULL OR thoiGianHoanThanhMs > 0");
                    table.CheckConstraint("CK_LuotChoiThachThuc_tongSoCau", "tongSoCau >= 0");
                    table.ForeignKey(
                        name: "FK_LuotChoiThachThuc_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LuotChoiThachThuc_ThachThuc_ChallengeId1",
                        column: x => x.ChallengeId1,
                        principalTable: "ThachThuc",
                        principalColumn: "idThachThuc");
                    table.ForeignKey(
                        name: "FK_LuotChoiThachThuc_ThachThuc_idThachThuc",
                        column: x => x.idThachThuc,
                        principalTable: "ThachThuc",
                        principalColumn: "idThachThuc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiemPhienChoi",
                columns: table => new
                {
                    idDiem = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPhienChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    tongDiem = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    xepHangCuoi = table.Column<int>(type: "int", nullable: true),
                    soCauDung = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    tongSoCau = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    tiLeChinhXac = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false, defaultValue: 0m),
                    GameSessionId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiemPhienChoi", x => x.idDiem);
                    table.CheckConstraint("CK_DiemPhienChoi_soCauDung", "soCauDung >= 0 AND soCauDung <= tongSoCau");
                    table.CheckConstraint("CK_DiemPhienChoi_tiLeChinhXac", "tiLeChinhXac >= 0 AND tiLeChinhXac <= 100");
                    table.CheckConstraint("CK_DiemPhienChoi_tongDiem", "tongDiem >= 0");
                    table.CheckConstraint("CK_DiemPhienChoi_tongSoCau", "tongSoCau >= 0");
                    table.CheckConstraint("CK_DiemPhienChoi_xepHangCuoi", "xepHangCuoi IS NULL OR xepHangCuoi > 0");
                    table.ForeignKey(
                        name: "FK_DiemPhienChoi_NguoiChoiPhien_idNguoiChoi",
                        column: x => x.idNguoiChoi,
                        principalTable: "NguoiChoiPhien",
                        principalColumn: "idNguoiChoi");
                    table.ForeignKey(
                        name: "FK_DiemPhienChoi_PhienChoi_GameSessionId1",
                        column: x => x.GameSessionId1,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi");
                    table.ForeignKey(
                        name: "FK_DiemPhienChoi_PhienChoi_idPhienChoi",
                        column: x => x.idPhienChoi,
                        principalTable: "PhienChoi",
                        principalColumn: "idPhienChoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TraLoiNguoiChoi",
                columns: table => new
                {
                    idTraLoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiChoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoiPhien = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    laDapAnDung = table.Column<bool>(type: "bit", nullable: false),
                    thoiGianMs = table.Column<int>(type: "int", nullable: false),
                    diemNhan = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TraLoiNguoiChoi", x => x.idTraLoi);
                    table.CheckConstraint("CK_TraLoiNguoiChoi_diemNhan", "diemNhan >= 0");
                    table.CheckConstraint("CK_TraLoiNguoiChoi_thoiGianMs", "thoiGianMs > 0");
                    table.ForeignKey(
                        name: "FK_TraLoiNguoiChoi_CauHoiPhienChoi_idCauHoiPhien",
                        column: x => x.idCauHoiPhien,
                        principalTable: "CauHoiPhienChoi",
                        principalColumn: "idCauHoiPhien",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TraLoiNguoiChoi_NguoiChoiPhien_idNguoiChoi",
                        column: x => x.idNguoiChoi,
                        principalTable: "NguoiChoiPhien",
                        principalColumn: "idNguoiChoi",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BaiNop",
                columns: table => new
                {
                    idBaiNop = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBaiTapVeNha = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idNguoiDung = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idLuotChoiThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    diem = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    thoiGianNop = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    HomeworkId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaiNop", x => x.idBaiNop);
                    table.CheckConstraint("CK_BaiNop_diem", "diem >= 0");
                    table.CheckConstraint("CK_BaiNop_trangThai", "trangThai IN ('Submitted', 'Late', 'NotSubmitted')");
                    table.ForeignKey(
                        name: "FK_BaiNop_BaiTapVeNha_HomeworkId1",
                        column: x => x.HomeworkId1,
                        principalTable: "BaiTapVeNha",
                        principalColumn: "idBaiTapVeNha");
                    table.ForeignKey(
                        name: "FK_BaiNop_BaiTapVeNha_idBaiTapVeNha",
                        column: x => x.idBaiTapVeNha,
                        principalTable: "BaiTapVeNha",
                        principalColumn: "idBaiTapVeNha",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BaiNop_LuotChoiThachThuc_idLuotChoiThachThuc",
                        column: x => x.idLuotChoiThachThuc,
                        principalTable: "LuotChoiThachThuc",
                        principalColumn: "idLuotChoi",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BaiNop_NguoiDung_idNguoiDung",
                        column: x => x.idNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "idNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CauTraLoiThachThuc",
                columns: table => new
                {
                    idCauTraLoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idLuotChoiThachThuc = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idCauHoi = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    thoiGianNopMs = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    dung = table.Column<bool>(type: "bit", nullable: false),
                    diemDat = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ChallengeAttemptId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ngayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauTraLoiThachThuc", x => x.idCauTraLoi);
                    table.CheckConstraint("CK_CauTraLoiThachThuc_diemDat", "diemDat >= 0");
                    table.CheckConstraint("CK_CauTraLoiThachThuc_thoiGianNopMs", "thoiGianNopMs >= 0");
                    table.ForeignKey(
                        name: "FK_CauTraLoiThachThuc_CauHoi_idCauHoi",
                        column: x => x.idCauHoi,
                        principalTable: "CauHoi",
                        principalColumn: "idCauHoi",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CauTraLoiThachThuc_LuotChoiThachThuc_ChallengeAttemptId1",
                        column: x => x.ChallengeAttemptId1,
                        principalTable: "LuotChoiThachThuc",
                        principalColumn: "idLuotChoi");
                    table.ForeignKey(
                        name: "FK_CauTraLoiThachThuc_LuotChoiThachThuc_idLuotChoiThachThuc",
                        column: x => x.idLuotChoiThachThuc,
                        principalTable: "LuotChoiThachThuc",
                        principalColumn: "idLuotChoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaiNop_HomeworkId1",
                table: "BaiNop",
                column: "HomeworkId1");

            migrationBuilder.CreateIndex(
                name: "IX_BaiNop_idBaiTapVeNha_idNguoiDung",
                table: "BaiNop",
                columns: new[] { "idBaiTapVeNha", "idNguoiDung" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BaiNop_idLuotChoiThachThuc",
                table: "BaiNop",
                column: "idLuotChoiThachThuc",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BaiNop_idNguoiDung",
                table: "BaiNop",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_BaiNop_trangThai",
                table: "BaiNop",
                column: "trangThai");

            migrationBuilder.CreateIndex(
                name: "IX_BaiTapVeNha_ClassId1",
                table: "BaiTapVeNha",
                column: "ClassId1");

            migrationBuilder.CreateIndex(
                name: "IX_BaiTapVeNha_hanChot",
                table: "BaiTapVeNha",
                column: "hanChot");

            migrationBuilder.CreateIndex(
                name: "IX_BaiTapVeNha_idBoTracNghiem",
                table: "BaiTapVeNha",
                column: "idBoTracNghiem");

            migrationBuilder.CreateIndex(
                name: "IX_BaiTapVeNha_idLopHoc",
                table: "BaiTapVeNha",
                column: "idLopHoc");

            migrationBuilder.CreateIndex(
                name: "IX_BaiTapVeNha_idLopHoc_hanChot",
                table: "BaiTapVeNha",
                columns: new[] { "idLopHoc", "hanChot" });

            migrationBuilder.CreateIndex(
                name: "IX_BaiTapVeNha_ngayXoa",
                table: "BaiTapVeNha",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_BoTracNghiem_daDangTai",
                table: "BoTracNghiem",
                column: "daDangTai");

            migrationBuilder.CreateIndex(
                name: "IX_BoTracNghiem_daDangTai_ngayXoa_ngayTao",
                table: "BoTracNghiem",
                columns: new[] { "daDangTai", "ngayXoa", "ngayTao" });

            migrationBuilder.CreateIndex(
                name: "IX_BoTracNghiem_idNguoiDung",
                table: "BoTracNghiem",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_BoTracNghiem_ngayXoa",
                table: "BoTracNghiem",
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
                name: "IX_CauHoi_idBoTracNghiem",
                table: "CauHoi",
                column: "idBoTracNghiem");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_idBoTracNghiem_thuTu",
                table: "CauHoi",
                columns: new[] { "idBoTracNghiem", "thuTu" },
                filter: "ngayXoa IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_ngayXoa",
                table: "CauHoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_QuizSetId1",
                table: "CauHoi",
                column: "QuizSetId1");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_thuTu",
                table: "CauHoi",
                column: "thuTu");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_TracNghiem_QuestionId",
                table: "CauHoi_TracNghiem",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiPhienChoi_GameSessionId1",
                table: "CauHoiPhienChoi",
                column: "GameSessionId1");

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
                columns: new[] { "idPhienChoi", "viTriTrongPhien" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CauHoiPhienChoi_ngayXoa",
                table: "CauHoiPhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiThachThuc_ChallengeAttemptId1",
                table: "CauTraLoiThachThuc",
                column: "ChallengeAttemptId1");

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
                columns: new[] { "idLuotChoiThachThuc", "idCauHoi" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CauTraLoiThachThuc_ngayXoa",
                table: "CauTraLoiThachThuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_GameSessionId1",
                table: "DiemPhienChoi",
                column: "GameSessionId1");

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
                name: "IX_DiemPhienChoi_idPhienChoi_tongDiem",
                table: "DiemPhienChoi",
                columns: new[] { "idPhienChoi", "tongDiem" });

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_idPhienChoi_xepHangCuoi",
                table: "DiemPhienChoi",
                columns: new[] { "idPhienChoi", "xepHangCuoi" });

            migrationBuilder.CreateIndex(
                name: "IX_DiemPhienChoi_ngayXoa",
                table: "DiemPhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_LopHoc_idGiaoVien",
                table: "LopHoc",
                column: "idGiaoVien");

            migrationBuilder.CreateIndex(
                name: "IX_LopHoc_maLop",
                table: "LopHoc",
                column: "maLop",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LopHoc_ngayXoa",
                table: "LopHoc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_bietDanh",
                table: "LuotChoiThachThuc",
                column: "bietDanh");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_ChallengeId1",
                table: "LuotChoiThachThuc",
                column: "ChallengeId1");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_idNguoiDung",
                table: "LuotChoiThachThuc",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_idThachThuc",
                table: "LuotChoiThachThuc",
                column: "idThachThuc");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_idThachThuc_diemDat_thoiGianHoanTatLuot",
                table: "LuotChoiThachThuc",
                columns: new[] { "idThachThuc", "diemDat", "thoiGianHoanTatLuot" });

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_ngayXoa",
                table: "LuotChoiThachThuc",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_LuotChoiThachThuc_thoiGianHoanTatLuot",
                table: "LuotChoiThachThuc",
                column: "thoiGianHoanTatLuot");

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_hetHanLuc",
                table: "MaLamMoi",
                column: "hetHanLuc");

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_idNguoiDung",
                table: "MaLamMoi",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_maToken",
                table: "MaLamMoi",
                column: "maToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaLamMoi_thuHoiLuc",
                table: "MaLamMoi",
                column: "thuHoiLuc");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_hetHanLuc",
                table: "MaNguoiDung",
                column: "hetHanLuc");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_idNguoiDung",
                table: "MaNguoiDung",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_idNguoiDung_loaiToken_suDungLuc",
                table: "MaNguoiDung",
                columns: new[] { "idNguoiDung", "loaiToken", "suDungLuc" });

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_loaiToken",
                table: "MaNguoiDung",
                column: "loaiToken");

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_maToken",
                table: "MaNguoiDung",
                column: "maToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaNguoiDung_suDungLuc",
                table: "MaNguoiDung",
                column: "suDungLuc");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_GameSessionId1",
                table: "NguoiChoiPhien",
                column: "GameSessionId1");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_idPhienChoi",
                table: "NguoiChoiPhien",
                column: "idPhienChoi");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_idPhienChoi_ngayTao",
                table: "NguoiChoiPhien",
                columns: new[] { "idPhienChoi", "ngayTao" });

            migrationBuilder.CreateIndex(
                name: "IX_NguoiChoiPhien_ngayXoa",
                table: "NguoiChoiPhien",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_email",
                table: "NguoiDung",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_idVaiTro",
                table: "NguoiDung",
                column: "idVaiTro");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_ngayXoa",
                table: "NguoiDung",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_RoleId1",
                table: "NguoiDung",
                column: "RoleId1");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_idBoTracNghiem",
                table: "PhienChoi",
                column: "idBoTracNghiem");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_idChuPhong",
                table: "PhienChoi",
                column: "idChuPhong");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_maPIN_trangThai",
                table: "PhienChoi",
                columns: new[] { "maPIN", "trangThai" });

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_ngayXoa",
                table: "PhienChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_PhienChoi_trangThai",
                table: "PhienChoi",
                column: "trangThai");

            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_idBoTracNghiem",
                table: "ThachThuc",
                column: "idBoTracNghiem");

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
                name: "IX_ThachThuc_trangThai_ngayXoa_luotChoi",
                table: "ThachThuc",
                columns: new[] { "trangThai", "ngayXoa", "luotChoi" });

            migrationBuilder.CreateIndex(
                name: "IX_ThachThuc_urlChiaSe",
                table: "ThachThuc",
                column: "urlChiaSe",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ThanhVienLop_ClassId1",
                table: "ThanhVienLop",
                column: "ClassId1");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhVienLop_idLopHoc",
                table: "ThanhVienLop",
                column: "idLopHoc");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhVienLop_idLopHoc_idNguoiDung",
                table: "ThanhVienLop",
                columns: new[] { "idLopHoc", "idNguoiDung" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ThanhVienLop_idNguoiDung",
                table: "ThanhVienLop",
                column: "idNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_ThongKeCauHoi_doDung",
                table: "ThongKeCauHoi",
                column: "doDung");

            migrationBuilder.CreateIndex(
                name: "IX_ThongKeCauHoi_idCauHoi",
                table: "ThongKeCauHoi",
                column: "idCauHoi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TraLoiNguoiChoi_idCauHoiPhien",
                table: "TraLoiNguoiChoi",
                column: "idCauHoiPhien");

            migrationBuilder.CreateIndex(
                name: "IX_TraLoiNguoiChoi_idNguoiChoi",
                table: "TraLoiNguoiChoi",
                column: "idNguoiChoi");

            migrationBuilder.CreateIndex(
                name: "IX_TraLoiNguoiChoi_idNguoiChoi_idCauHoiPhien",
                table: "TraLoiNguoiChoi",
                columns: new[] { "idNguoiChoi", "idCauHoiPhien" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TraLoiNguoiChoi_ngayXoa",
                table: "TraLoiNguoiChoi",
                column: "ngayXoa");

            migrationBuilder.CreateIndex(
                name: "IX_VaiTro_tenVaiTro",
                table: "VaiTro",
                column: "tenVaiTro",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaiNop");

            migrationBuilder.DropTable(
                name: "CaiDatPhienChoi");

            migrationBuilder.DropTable(
                name: "CauHoi_TracNghiem");

            migrationBuilder.DropTable(
                name: "CauTraLoiThachThuc");

            migrationBuilder.DropTable(
                name: "DiemPhienChoi");

            migrationBuilder.DropTable(
                name: "MaLamMoi");

            migrationBuilder.DropTable(
                name: "MaNguoiDung");

            migrationBuilder.DropTable(
                name: "ThanhVienLop");

            migrationBuilder.DropTable(
                name: "ThongKeCauHoi");

            migrationBuilder.DropTable(
                name: "TraLoiNguoiChoi");

            migrationBuilder.DropTable(
                name: "BaiTapVeNha");

            migrationBuilder.DropTable(
                name: "LuotChoiThachThuc");

            migrationBuilder.DropTable(
                name: "CauHoiPhienChoi");

            migrationBuilder.DropTable(
                name: "NguoiChoiPhien");

            migrationBuilder.DropTable(
                name: "LopHoc");

            migrationBuilder.DropTable(
                name: "ThachThuc");

            migrationBuilder.DropTable(
                name: "CauHoi");

            migrationBuilder.DropTable(
                name: "PhienChoi");

            migrationBuilder.DropTable(
                name: "BoTracNghiem");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "VaiTro");
        }
    }
}
