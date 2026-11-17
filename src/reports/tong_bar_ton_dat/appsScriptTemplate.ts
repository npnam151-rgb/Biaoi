export const TONG_BAR_TON_DAT_APPS_SCRIPT = `// ============================================================================
// CẤU HÌNH FILE THỨ 2 (LƯU ĐỒNG THỜI VÀO 2 FILE GOOGLE SHEETS CHO SALE SỈ & QL KÊNH)
// Dán ID của file thứ 2 vào đây (chuỗi ký tự nằm giữa /d/ và /edit trên link của file 2)
// ============================================================================
var SECOND_SPREADSHEET_ID = "1S2epup9cDgckvmVCPUuWGcK55gLwY9jpfImT55pgLj0";

// ============================================================================
// CẤU HÌNH BÁO CÁO TỔNG BAR TỒN & ĐẶT HÀNG CUỐI NGÀY (2 CHIỀU)
// - "BC Tồn Đặt Bar": Sheet lưu toàn bộ lịch sử record từng lần gửi
// - "TH Bar": Sheet báo cáo tổng hợp dạng bảng 6 chi nhánh theo ngày
// ============================================================================
var TON_DAT_RECORD_SHEET = "BC Tồn Đặt Bar";
var TON_DAT_SUMMARY_SHEET = "TH Bar";
var TON_DAT_STORES = ["01 ĐD", "03 NVH", "12 ĐT", "94 LĐ", "96 HT", "98 VTP"];

var TON_DAT_UNIT_DEFS = [
  { key: "bom_30l_bom", product: "Bom 30L", unit: "bom" },
  { key: "bom_50l_bom", product: "Bom 50L", unit: "bom" },
  { key: "keg_1l_ket", product: "Keg1L", unit: "két" },
  { key: "keg_1l_keg", product: "Keg1L", unit: "keg" },
  { key: "tb_craft_xach", product: "TB craft", unit: "xách" },
  { key: "tb_craft_chai", product: "TB craft", unit: "chai" },
  { key: "ruou_mo_can", product: "Rượu Mơ", unit: "can" },
  { key: "ruou_mo_chai", product: "Rượu Mơ", unit: "chai" },
  { key: "ruou_dua_can", product: "Rượu Dứa", unit: "can" },
  { key: "ruou_dua_chai", product: "Rượu Dứa", unit: "chai" },
  { key: "hn_pre_chai_ket", product: "HN pre chai", unit: "két" },
  { key: "hn_pre_chai_chai", product: "HN pre chai", unit: "chai" },
  { key: "tb_chai_ket", product: "TB chai", unit: "két" },
  { key: "tb_chai_chai", product: "TB chai", unit: "chai" },
  { key: "hn_pre_lon_thung", product: "HN pre lon", unit: "thùng" },
  { key: "hn_pre_lon_lon", product: "HN pre lon", unit: "lon" },
  { key: "tb_lon_thung", product: "TB lon", unit: "thùng" },
  { key: "tb_lon_lon", product: "TB lon", unit: "lon" },
  { key: "coca_thung", product: "Coca", unit: "thùng" },
  { key: "coca_lon", product: "Coca", unit: "lon" },
  { key: "uniqua_thung", product: "Uniqua", unit: "thùng" },
  { key: "uniqua_chai", product: "Uniqua", unit: "chai" }
];

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";
    if (action === "getTonDatBar") {
      var dateStr = (e.parameter.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd")).trim();
      var result = readLatestTonDatForDate_(dateStr);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput("Web App is running!").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Tự động cập nhật bảng TH Bar khi đổi ngày ở ô B1:C1 trực tiếp trên Google Sheets
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (!sheet || sheet.getName().trim().toLowerCase() !== TON_DAT_SUMMARY_SHEET.toLowerCase()) return;
    if (e.range.getRow() !== 1 || (e.range.getColumn() !== 2 && e.range.getColumn() !== 3)) return;

    var ss = e.source || SpreadsheetApp.getActiveSpreadsheet();
    var rawDateVal = sheet.getRange(1, 2).getValue();
    var dateStr = parseThBarDateInput_(rawDateVal, ss);
    if (!dateStr) return;

    var latest = readLatestTonDatForDate_(dateStr);
    renderTonDatSummarySheet_(ss, dateStr, latest.branches);
  } catch (err) {
    console.error("onEdit TH Bar error: " + err);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Tên sheet gửi từ app (Mặc định là BC TQL nếu không truyền)
    var sheetName = data.sheetName || "BC TQL";

    // =========================================================================
    // -1. BÁO CÁO TỔNG BAR TỒN & ĐẶT HÀNG CUỐI NGÀY (BC Tồn Đặt Bar + TH Bar)
    // =========================================================================
    if (sheetName === TON_DAT_RECORD_SHEET || data.action === "saveTonDatBar") {
      var ssBar = SpreadsheetApp.getActiveSpreadsheet();
      var recordSheet = ensureTonDatRecordSheet_(ssBar);
      var dateValBar = normalizeBarDateStr_(data.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"));
      var nowBar = new Date();
      var submissions = Array.isArray(data.submissions) ? data.submissions : [];

      submissions.forEach(function(sub) {
        var branchCode = sub.branchCode || "";
        var staffName = sub.staffName || "";
        var tonMap = sub.ton || {};
        var datMap = sub.dat || {};

        var tonRow = [nowBar, dateValBar, branchCode, staffName, "TỒN"];
        var datRow = [nowBar, dateValBar, branchCode, staffName, "ĐẶT"];

        TON_DAT_UNIT_DEFS.forEach(function(u) {
          tonRow.push(parseBarCellVal_(tonMap[u.key]));
          datRow.push(parseBarCellVal_(datMap[u.key]));
        });

        recordSheet.appendRow(tonRow);
        recordSheet.appendRow(datRow);
      });

      var latestForDate = readLatestTonDatForDate_(dateValBar);
      renderTonDatSummarySheet_(ssBar, dateValBar, latestForDate.branches);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        date: dateValBar,
        savedCount: submissions.length,
        branches: latestForDate.branches
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetName);

    // Tìm kiếm sheet không phân biệt chữ hoa/thường và khoảng trắng thừa
    if (!sheet) {
      var sheets = spreadsheet.getSheets();
      var cleanTarget = sheetName.trim().toLowerCase().replace(/\\s+/g, " ");
      for (var s = 0; s < sheets.length; s++) {
        var sName = sheets[s].getName().trim().toLowerCase().replace(/\\s+/g, " ");
        if (sName === cleanTarget || (cleanTarget.indexOf("ql k") !== -1 && sName.indexOf("ql k") !== -1)) {
          sheet = sheets[s];
          break;
        }
      }
    }

    // Tự động tạo sheet nếu chưa có
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    var row = [];

    // =========================================================================
    // XỬ LÝ THEO TỪNG LOẠI BẢNG CŨ (GIỮ NGUYÊN 100%)
    // =========================================================================

    // 0. BÁO CÁO QUẢN LÝ KÊNH (BC QL KÊNH - 12 CỘT CHUẨN FORM MẪU CHO 5 SALE & PHẦN CHUNG)
    if (sheetName === "BC QL kênh" || sheetName === "BC QL Kênh" || sheetName === "BC Quản lý kênh" || sheetName === "BC quản lý kênh") {
      if (sheet.getLastRow() === 0) {
        var headerRow1 = [
          "Thời gian gửi",
          "Ngày",
          "Kết quả chăm sóc điểm bán", "", "", "", "", "",
          "Tổng kết công việc trong ngày", "", "", ""
        ];
        var headerRow2 = [
          "",
          "",
          "Tên NV Sale",
          "Số điểm ghé trong ngày",
          "Khách hàng mới",
          "Đơn hàng",
          "Sản lượng",
          "Tình hình",
          "Khách tiềm năng",
          "Khách giảm/ khách có nguy cơ mất",
          "Vấn đề thị trường",
          "Đề xuất"
        ];
        sheet.appendRow(headerRow1);
        sheet.appendRow(headerRow2);
        sheet.getRange(1, 1, 2, 1).merge();
        sheet.getRange(1, 2, 2, 1).merge();
        sheet.getRange(1, 3, 1, 6).merge();
        sheet.getRange(1, 9, 1, 4).merge();
        sheet.getRange(1, 1, 2, 12)
          .setFontWeight("bold")
          .setBackground("#f3f4f6")
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle");
        sheet.setFrozenRows(2);
      }

      var nowTime = new Date();
      var reportDate = data.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
      var commonPotential = data.potentialCustomers || "";
      var commonDeclining = data.decliningRiskCustomers || "";
      var commonMarket = data.marketIssues || "";
      var commonProposal = data.proposal || "";

      var rawSalesList = (data.sales && Array.isArray(data.sales) && data.sales.length > 0)
        ? data.sales
        : (data.salesList && Array.isArray(data.salesList) && data.salesList.length > 0)
          ? data.salesList
          : [data];

      var activeSalesList = [];
      for (var sIdx = 0; sIdx < rawSalesList.length; sIdx++) {
        var rawSale = rawSalesList[sIdx];
        var rawName = (rawSale.salesRepName || rawSale.name || rawSale.reporter || "").toString().trim();
        if (rawName !== "") {
          activeSalesList.push(rawSale);
        }
      }

      if (activeSalesList.length === 0) {
        for (var sIdx2 = 0; sIdx2 < rawSalesList.length; sIdx2++) {
          var rSale = rawSalesList[sIdx2];
          if (rSale.visitedCount || rSale.ordersCount || rSale.volume || rSale.newCustomers || rSale.situation) {
            activeSalesList.push(rSale);
          }
        }
        if (activeSalesList.length === 0) {
          activeSalesList = [rawSalesList[0]];
        }
      }

      var rowsToSave = [];
      for (var i = 0; i < activeSalesList.length; i++) {
        var s = activeSalesList[i];
        var sName = (s.salesRepName && s.salesRepName.toString().trim() !== "") ? s.salesRepName.toString().trim()
          : (s.name && s.name.toString().trim() !== "") ? s.name.toString().trim()
          : (s.reporter && s.reporter.toString().trim() !== "") ? s.reporter.toString().trim()
          : ("Sale " + (i + 1));

        var sVisited = s.visitedCount !== undefined ? String(s.visitedCount).trim() : "";
        var sNewCust = s.newCustomers ? String(s.newCustomers).trim() : "";
        var sOrders = s.ordersCount ? String(s.ordersCount).trim() : "";
        var sVolume = s.volume ? String(s.volume).trim() : "";
        var sSituation = s.situation ? String(s.situation).trim() : "";

        rowsToSave.push([
          nowTime,
          reportDate,
          sName,
          sVisited,
          sNewCust,
          sOrders,
          sVolume,
          sSituation,
          i === 0 ? commonPotential : "",
          i === 0 ? commonDeclining : "",
          i === 0 ? commonMarket : "",
          i === 0 ? commonProposal : ""
        ]);
      }

      // Ghi File 1
      var lastRow1 = sheet.getLastRow();
      var actualLastRow1 = 0;
      if (lastRow1 > 0) {
        var colA1 = sheet.getRange(1, 1, Math.min(lastRow1, 1000), 1).getValues();
        for (var r1 = colA1.length - 1; r1 >= 0; r1--) {
          if (colA1[r1][0] !== "" && colA1[r1][0] !== null && colA1[r1][0] !== undefined) {
            actualLastRow1 = r1 + 1;
            break;
          }
        }
      }
      var targetRow1 = Math.max(actualLastRow1 + 1, (sheet.getLastRow() <= 2 ? 3 : actualLastRow1 + 1));

      var recordRange1 = sheet.getRange(targetRow1, 1, rowsToSave.length, 12);
      recordRange1.setValues(rowsToSave);
      recordRange1.setBorder(true, null, true, null, null, null, "#000000", SpreadsheetApp.BorderStyle.SOLID);
      recordRange1.setVerticalAlignment("middle");
      recordRange1.setWrap(true);
      sheet.getRange(targetRow1, 1, rowsToSave.length, 2).setHorizontalAlignment("center");
      sheet.getRange(targetRow1, 4, rowsToSave.length, 3).setHorizontalAlignment("center");

      // Ghi File 2
      if (typeof SECOND_SPREADSHEET_ID !== "undefined" && SECOND_SPREADSHEET_ID && SECOND_SPREADSHEET_ID.trim() !== "") {
        try {
          var ss2 = SpreadsheetApp.openById(SECOND_SPREADSHEET_ID.trim());
          var sheet2 = ss2.getSheetByName("BC QL kênh") || ss2.getSheetByName("BC QL Kênh") || ss2.getSheetByName("BC Quản lý kênh");
          if (!sheet2) {
            var sheets2 = ss2.getSheets();
            for (var k = 0; k < sheets2.length; k++) {
              var s2Name = sheets2[k].getName().trim().toLowerCase();
              if (s2Name.indexOf("ql k") !== -1 || s2Name.indexOf("quản lý k") !== -1) {
                sheet2 = sheets2[k];
                break;
              }
            }
          }
          if (!sheet2) {
            sheet2 = ss2.insertSheet("BC QL kênh");
          }

          if (sheet2.getLastRow() === 0) {
            var hRow1_2 = [
              "Thời gian gửi",
              "Ngày",
              "Kết quả chăm sóc điểm bán", "", "", "", "", "",
              "Tổng kết công việc trong ngày", "", "", ""
            ];
            var hRow2_2 = [
              "",
              "",
              "Tên NV Sale",
              "Số điểm ghé trong ngày",
              "Khách hàng mới",
              "Đơn hàng",
              "Sản lượng",
              "Tình hình",
              "Khách tiềm năng",
              "Khách giảm/ khách có nguy cơ mất",
              "Vấn đề thị trường",
              "Đề xuất"
            ];
            sheet2.appendRow(hRow1_2);
            sheet2.appendRow(hRow2_2);
            sheet2.getRange(1, 1, 2, 1).merge();
            sheet2.getRange(1, 2, 2, 1).merge();
            sheet2.getRange(1, 3, 1, 6).merge();
            sheet2.getRange(1, 9, 1, 4).merge();
            sheet2.getRange(1, 1, 2, 12)
              .setFontWeight("bold")
              .setBackground("#f3f4f6")
              .setHorizontalAlignment("center")
              .setVerticalAlignment("middle");
            sheet2.setFrozenRows(2);
          }

          var lastRow2 = sheet2.getLastRow();
          var actualLastRow2 = 0;
          if (lastRow2 > 0) {
            var colA2 = sheet2.getRange(1, 1, Math.min(lastRow2, 1000), 1).getValues();
            for (var r2 = colA2.length - 1; r2 >= 0; r2--) {
              if (colA2[r2][0] !== "" && colA2[r2][0] !== null && colA2[r2][0] !== undefined) {
                actualLastRow2 = r2 + 1;
                break;
              }
            }
          }
          var targetRow2 = Math.max(actualLastRow2 + 1, (sheet2.getLastRow() <= 2 ? 3 : actualLastRow2 + 1));

          var recordRange2 = sheet2.getRange(targetRow2, 1, rowsToSave.length, 12);
          recordRange2.setValues(rowsToSave);
          recordRange2.setBorder(true, null, true, null, null, null, "#000000", SpreadsheetApp.BorderStyle.SOLID);
          recordRange2.setVerticalAlignment("middle");
          recordRange2.setWrap(true);
          sheet2.getRange(targetRow2, 1, rowsToSave.length, 2).setHorizontalAlignment("center");
          sheet2.getRange(targetRow2, 4, rowsToSave.length, 3).setHorizontalAlignment("center");

        } catch (err2) {
          console.error("Lỗi khi ghi File 2 (BC QL kênh): " + err2);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Đã lưu 5 sale vào BC QL kênh tại cả 2 file"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. BÁO CÁO SALE SỈ (GIỮ NGUYÊN 100%)
    else if (sheetName === "BC sale sỉ" || sheetName === "BC Sale sỉ" || sheetName === "BC Sale Sỉ") {
      var isSingleVisitApp = (data.restaurantName !== undefined);

      if (isSingleVisitApp) {
        if (sheet.getLastRow() === 0) {
          var headerRow1 = [
            "Thời gian gửi",
            "Ngày",
            "Người báo cáo",
            "Điểm cũ/ Điểm mới",
            "Tên điểm bán",
            "Địa chỉ điểm bán",
            "Đánh giá/ Đề xuất",
            "TỒN KHO", "", "",
            "ĐẶT HÀNG", "", ""
          ];
          var headerRow2 = [
            "", "", "", "", "", "", "",
            "Bom 30L", "Bom 50L", "Keg1L",
            "Bom 30L", "Bom 50L", "Keg1L"
          ];
          sheet.appendRow(headerRow1);
          sheet.appendRow(headerRow2);
          for (var c = 1; c <= 7; c++) {
            sheet.getRange(1, c, 2, 1).merge();
          }
          sheet.getRange(1, 8, 1, 3).merge();
          sheet.getRange(1, 11, 1, 3).merge();
          sheet.getRange(1, 1, 2, 13)
            .setFontWeight("bold")
            .setBackground("#f3f4f6")
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");
          sheet.setFrozenRows(2);
        }

        var firstRowCol4 = sheet.getRange(1, 4).getValue();
        var secondRowCol4 = sheet.getLastRow() >= 2 ? sheet.getRange(2, 4).getValue() : "";
        var hasVisitOrderCol1 = (
          (firstRowCol4 && firstRowCol4.toString().indexOf("Điểm thứ") !== -1) ||
          (secondRowCol4 && secondRowCol4.toString().indexOf("Điểm thứ") !== -1)
        );

        if (hasVisitOrderCol1) {
          row.push(
            new Date(),
            data.date || "",
            data.reporter || "",
            data.visitOrder || "",
            data.outletType || "Điểm cũ",
            data.restaurantName || "",
            data.address || "",
            data.evaluationOrProposal || "",
            data.stockBom30L || "",
            data.stockBom50L || "",
            data.stockKeg1L || "",
            data.orderBom30L || "",
            data.orderBom50L || "",
            data.orderKeg1L || ""
          );
        } else {
          row.push(
            new Date(),
            data.date || "",
            data.reporter || "",
            data.outletType || "Điểm cũ",
            data.restaurantName || "",
            data.address || "",
            data.evaluationOrProposal || "",
            data.stockBom30L || "",
            data.stockBom50L || "",
            data.stockKeg1L || "",
            data.orderBom30L || "",
            data.orderBom50L || "",
            data.orderKeg1L || ""
          );
        }

        if (typeof SECOND_SPREADSHEET_ID !== "undefined" && SECOND_SPREADSHEET_ID && SECOND_SPREADSHEET_ID.trim() !== "") {
          try {
            var ss2 = SpreadsheetApp.openById(SECOND_SPREADSHEET_ID.trim());
            var sheet2 = ss2.getSheetByName("BC sale sỉ") || ss2.getSheetByName("BC Sale sỉ") || ss2.getSheets()[0];
            if (sheet2) {
              var autoVisitOrder2 = 1;
              var lastRow2 = sheet2.getLastRow();
              if (lastRow2 >= 3) {
                var todayStr = data.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
                var datesData2 = sheet2.getRange(3, 2, lastRow2 - 2, 1).getValues();
                var dayCount2 = 0;
                for (var d2 = 0; d2 < datesData2.length; d2++) {
                  var cellVal = datesData2[d2][0];
                  if (cellVal) {
                    var cellStr = (cellVal instanceof Date) ? Utilities.formatDate(cellVal, "GMT+7", "yyyy-MM-dd") : cellVal.toString();
                    if (cellStr.indexOf(todayStr) !== -1 || todayStr.indexOf(cellStr) !== -1) {
                      dayCount2++;
                    }
                  }
                }
                autoVisitOrder2 = dayCount2 + 1;
              } else if (lastRow2 === 2) {
                autoVisitOrder2 = 1;
              }

              var visitOrder2 = data.visitOrder || autoVisitOrder2;
              var typeVal2 = "cũ";
              if (data.outletType) {
                if (data.outletType.indexOf("mới") !== -1 || data.outletType.indexOf("Mới") !== -1) {
                  typeVal2 = "mới";
                } else {
                  typeVal2 = "cũ";
                }
              }

              sheet2.appendRow([
                new Date(),
                data.date || "",
                data.reporter || "",
                visitOrder2,
                typeVal2,
                data.restaurantName || "",
                data.address || "",
                data.evaluationOrProposal || "",
                data.stockBom30L || "",
                data.stockBom50L || "",
                data.stockKeg1L || "",
                data.orderBom30L || "",
                data.orderBom50L || "",
                data.orderKeg1L || ""
              ]);
            }
          } catch (err2) {
            console.error("Lỗi khi ghi File 2: " + err2);
          }
        }

      } else {
        if (sheet.getLastRow() === 0) {
          var headersSaleSi = [
            "Thời gian gửi",
            "Ngày",
            "Người báo cáo",
            "Điểm mở mới",
            "Phát sinh/ Đề xuất",
            "Tổng số điểm đến chăm sóc",
            "Tổng số đơn đặt hàng"
          ];
          for (var i = 1; i <= 15; i++) {
            headersSaleSi.push("Điểm bán số " + i);
          }
          sheet.appendRow(headersSaleSi);
          sheet.getRange(1, 1, 1, headersSaleSi.length).setFontWeight("bold").setBackground("#f3f4f6");
          sheet.setFrozenRows(1);
        }

        row.push(
          new Date(),
          data.date || "",
          data.reporter || "",
          data.newOutlets || "",
          data.issuesOrProposals || "",
          data.visitedOutlets || "",
          data.totalOrders || ""
        );

        if (data.outlets && Array.isArray(data.outlets)) {
          for (var i = 0; i < 15; i++) {
            row.push(data.outlets[i] !== undefined ? data.outlets[i] : "");
          }
        } else if (data.items && Array.isArray(data.items)) {
          for (var i = 0; i < 15; i++) {
            row.push(data.items[i] ? (data.items[i].value || "") : "");
          }
        }
      }
    }

    // 2. BÁO CÁO CX (GIỮ NGUYÊN 100%)
    else if (sheetName === "BC CX") {
      if (sheet.getLastRow() === 0) {
        var headers = ["Thời gian gửi", "Cơ sở", "Ngày", "Người báo cáo", "Tổng điểm"];
        if (data.items && data.items.length > 0) {
          data.items.forEach(function(item) {
            headers.push(item.title + " (Đánh giá)");
            headers.push(item.title + " (Ghi chú)");
          });
        }
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
        sheet.setFrozenRows(1);
      }
      row.push(new Date(), data.location, data.date, data.reporter, data.totalScore);
      if (data.items && data.items.length > 0) {
        data.items.forEach(function(item) {
          row.push(item.value);
          row.push(item.notes);
        });
      }
    }

    // 3. BÁO CÁO BAR (GIỮ NGUYÊN 100%)
    else if (sheetName === "BC Bar" || sheetName === "BC Bar 1") {
      if (sheet.getLastRow() === 0) {
        var headersBar = ["Thời gian gửi", "Cơ sở", "Ngày", "Người báo cáo"];
        if (data.items && data.items.length > 0) {
          data.items.forEach(function(item) {
            headersBar.push(item.title);
          });
        }
        sheet.appendRow(headersBar);
        sheet.getRange(1, 1, 1, headersBar.length).setFontWeight("bold").setBackground("#f3f4f6");
        sheet.setFrozenRows(1);
      }
      row.push(new Date(), data.location, data.date, data.reporter);
      if (data.items && data.items.length > 0) {
        data.items.forEach(function(item) {
          row.push(item.value);
        });
      }
    }

    // 4. BÁO CÁO TỔNG BAR (GIỮ NGUYÊN 100%)
    else if (sheetName === "BC Tổng Bar") {
      if (sheet.getLastRow() === 0) {
        var headersLam = ["Thời gian gửi", "Cơ sở"];
        if (data.items && data.items.length > 0) {
          data.items.forEach(function(item) {
            headersLam.push(item.title);
          });
        }
        sheet.appendRow(headersLam);
        sheet.getRange(1, 1, 1, headersLam.length).setFontWeight("bold").setBackground("#f3f4f6");
        sheet.setFrozenRows(1);
      }
      row.push(new Date(), data.location);
      if (data.items && data.items.length > 0) {
        data.items.forEach(function(item) {
          row.push(item.value);
        });
      }
    }

    // 5. BÁO CÁO TQL (ĐÃ HỖ TRỢ 12B ĐT VÀ 12 ĐT)
    else if (sheetName === "BC TQL" || sheetName === "BC TQL 1" || sheetName === "Sheet17") {
      if (sheet.getLastRow() === 0) {
        var headersTQL = [
          "Thời gian gửi", "Ngày", "Người báo cáo",
          "DT toàn hệ thống:", "Mục tiêu ngày:", "Tăng/giảm so với hôm trc:", "Tổng lượt khách:", "Số bàn phục vụ:", "DT TB/khách:", "Xếp hạng DT:",
          "CH lv chính",
          "Hỏng hóc cần sửa:", "Hạng mục sửa trong ngày:",
          "Xếp bàn và đón tiếp:", "Order & tư vấn món:", "Chăm sóc KH & upsell:", "Tốc độ ra đồ:", "Chương trình KM:", "Vệ sinh:", "Vđ phát sinh:", "Cách giải quyết ps:",
          "Tổng NS bàn đi làm:", "NS nghỉ đột xuất:", "NS nghỉ hẳn:", "NS mới:", "NS hỗ trợ:",
          "Phản hồi của khách:", "Vđ phát sinh:", "Cách giải quyết ps:", "Xuất bán tiệc:",
          "Món đẩy:", "Món bán chạy:", "Phản hồi của khách:", "Vđ phát sinh:", "Cách giải quyết ps:",
          "Đào tạo:",
          "Đối ngoại:",
          "Ý KIẾN KHÁC"
        ];
        sheet.appendRow(headersTQL);
        sheet.getRange(1, 1, 1, headersTQL.length).setFontWeight("bold").setBackground("#f3f4f6");
        sheet.setFrozenRows(1);
      }

      var timeVal = data.time || Utilities.formatDate(new Date(), "GMT+7", "HH:mm");
      var dateVal = data.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
      var reporterVal = data.reporter || "";

      if (data.storesList && Array.isArray(data.storesList) && data.storesList.length > 0) {
        data.storesList.forEach(function(st) {
          var storeRow = [timeVal, dateVal, reporterVal];

          if (st.systemValues && Array.isArray(st.systemValues)) {
            st.systemValues.forEach(function(val) {
              storeRow.push(val !== undefined && val !== null ? String(val) : "");
            });
          } else {
            for (var s = 0; s < 7; s++) storeRow.push("");
          }

          storeRow.push(st.storeCode || st.storeName || "");

          if (st.storeValues && Array.isArray(st.storeValues)) {
            st.storeValues.forEach(function(val) {
              storeRow.push(val !== undefined && val !== null ? String(val) : "");
            });
          } else if (st.values && Array.isArray(st.values)) {
            for (var v = 7; v < st.values.length - 1; v++) {
              storeRow.push(st.values[v] !== undefined && st.values[v] !== null ? String(st.values[v]) : "");
            }
          } else {
            for (var stc = 0; stc < 26; stc++) storeRow.push("");
          }

          storeRow.push(st.otherOpinionValue !== undefined && st.otherOpinionValue !== null ? String(st.otherOpinionValue) : "");
          sheet.appendRow(storeRow);
        });
      } else if (data.stores) {
        var storeCodes = ["01 DD", "03 NVH", "12B ĐT", "94 LĐ", "96 HT", "98 VTP"];
        var systemKeys = [
          "dt_toan_he_thong", "muc_tieu_ngay", "tang_giam_hom_truoc", "tong_luot_khach", "so_ban_phuc_vu", "dt_tb_khach", "xep_hang_dt"
        ];
        var storeKeys = [
          "hong_hoc_can_sua", "hang_muc_sua_trong_ngay",
          "xep_ban", "order_tu_van", "cham_soc_upsell", "toc_do_ra_do", "chuong_trinh_km", "ve_sinh", "vd_phat_sinh_pv", "cach_giai_quyet_pv",
          "tong_ns_di_lam", "ns_nghi_dot_xuat", "ns_nghi_han", "ns_moi", "ns_ho_tro",
          "phan_hoi_khach_bia", "vd_phat_sinh_bia", "cach_giai_quyet_bia", "xuat_ban_tiec",
          "mon_day", "mon_ban_chay", "phan_hoi_khach_mon", "vd_phat_sinh_mon", "cach_giai_quyet_mon",
          "dao_tao",
          "doi_ngoai"
        ];
        var sysVals = data.systemEvaluation || {};
        storeCodes.forEach(function(code, idx) {
          var storeVals = data.stores[code] || (code === "12B ĐT" ? (data.stores["12 ĐT"] || data.stores["12BĐT"] || {}) : {});
          var storeRow = [timeVal, dateVal, reporterVal];

          systemKeys.forEach(function(k) {
            if (idx === 0) {
              var val = sysVals[k] !== undefined ? sysVals[k] : (storeVals[k] !== undefined ? storeVals[k] : "");
              storeRow.push(String(val || ""));
            } else {
              storeRow.push("");
            }
          });

          storeRow.push(code);

          storeKeys.forEach(function(k) {
            storeRow.push(storeVals[k] !== undefined ? String(storeVals[k]) : "");
          });

          if (idx === 0) {
            storeRow.push(sysVals.y_kien_khac ? String(sysVals.y_kien_khac) : "");
          } else {
            storeRow.push("");
          }

          sheet.appendRow(storeRow);
        });
      } else if (data.items && Array.isArray(data.items)) {
        var legacyRow = [new Date(), data.date || "", data.reporter || "", data.location || ""];
        data.items.forEach(function(item) {
          legacyRow.push(item.value || "");
        });
        sheet.appendRow(legacyRow);
      }

      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Đã lưu 6 cơ sở vào " + sheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. BÁO CÁO BẾP (GIỮ NGUYÊN 100%)
    else if (sheetName === "BC Bếp") {
      if (sheet.getLastRow() === 0) {
        var headerRow1 = [
          "", "", "",
          "NHÂN SỰ", "", "",
          "VẬN HÀNH BẾP", "", "",
          "TRANG THIẾT BỊ", "",
          "ĐỀ XUẤT"
        ];
        var headerRow2 = [
          "Cơ sở", "Ngày", "Người báo cáo",
          "Có đủ nv làm việc trong ngày?", "Có nv xin nghỉ hẳn không?", "NV mới đi làm",
          "Hàng đặt có về đủ không?", "Sự cố xảy ra trong ngày không? Nếu có xl ntn?", "Món bán chạy trong ngày",
          "CCDC, thiết bị hỏng trong ngày", "CCDC, thiết bị được sửa trong ngày",
          "Đề xuất"
        ];
        sheet.appendRow(headerRow1);
        sheet.appendRow(headerRow2);
        sheet.getRange(1, 4, 1, 3).merge();
        sheet.getRange(1, 7, 1, 3).merge();
        sheet.getRange(1, 10, 1, 2).merge();
        sheet.getRange(1, 1, 2, 12)
          .setFontWeight("bold")
          .setBackground("#f3f4f6")
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle");
        sheet.setFrozenRows(2);
      }

      var itemMap = {};
      if (data.items && data.items.length > 0) {
        data.items.forEach(function(item, idx) {
          if (item.id) {
            itemMap[item.id] = item.value || "";
          }
          itemMap["idx_" + idx] = item.value || "";
        });
      }

      var val201 = itemMap[201] !== undefined ? itemMap[201] : (itemMap["idx_0"] || "");
      var val202 = itemMap[202] !== undefined ? itemMap[202] : (itemMap["idx_1"] || "");
      var val203 = itemMap[203] !== undefined ? itemMap[203] : (itemMap["idx_2"] || "");
      var val204 = itemMap[204] !== undefined ? itemMap[204] : (itemMap["idx_3"] || "");
      var val205 = itemMap[205] !== undefined ? itemMap[205] : (itemMap["idx_4"] || "");
      var val206 = itemMap[206] !== undefined ? itemMap[206] : (itemMap["idx_5"] || "");
      var val207 = itemMap[207] !== undefined ? itemMap[207] : (itemMap["idx_6"] || "");
      var val208 = itemMap[208] !== undefined ? itemMap[208] : (itemMap["idx_7"] || "");
      var val209 = itemMap[209] !== undefined ? itemMap[209] : (itemMap["idx_8"] || "");

      var hasTimestamp = false;
      var headerRowIdx = sheet.getLastRow() >= 2 ? 2 : (sheet.getLastRow() >= 1 ? 1 : 0);
      if (headerRowIdx > 0) {
        var h1 = (sheet.getRange(headerRowIdx, 1).getValue() || "").toString().trim().toLowerCase();
        if (h1.indexOf("thời gian") !== -1 || h1.indexOf("time") !== -1) {
          hasTimestamp = true;
        }
      }

      if (hasTimestamp) {
        row.push(new Date());
      }

      row.push(
        data.location || "",
        data.date || "",
        data.reporter || "",
        val201, val202, val203, val204, val205, val206, val207, val208, val209
      );
    }

    // 7. BÁO CÁO VẬN HÀNH (24 CỘT CHUẨN A -> X)
    else if (sheetName === "BC Vận hành" || sheetName === "BC vận hành") {
      if (sheet.getLastRow() === 0) {
        var row1 = ["", "", "", "", "NHÂN SỰ", "", "", "", "", "", "SỬA CHỮA", "", "KINH DOANH", "", "", "", "", "", "", "", "", "", "THEO DÕI HỖ TRỢ", ""];
        sheet.appendRow(row1);
        sheet.getRange("E1:J1").mergeAcross().setHorizontalAlignment("center").setFontWeight("bold").setBackground("#fff2cc");
        sheet.getRange("K1:L1").mergeAcross().setHorizontalAlignment("center").setFontWeight("bold").setBackground("#ffe599");
        sheet.getRange("M1:V1").mergeAcross().setHorizontalAlignment("center").setFontWeight("bold").setBackground("#fff2cc");
        sheet.getRange("W1:X1").mergeAcross().setHorizontalAlignment("center").setFontWeight("bold").setBackground("#e2efda");

        var row2 = [
          "Thời gian gửi", "Cơ Sở", "Ngày", "Người báo cáo",
          "Nhân viên mới", "Nhân viên nghỉ việc (đột xuất/nghỉ hẳn/cho nghỉ)", "Số lượng nhân viên làm trong ngày", "Nhân viên vi phạm quy định", "Số lượng nv ngủ tại CH", "Đào tạo nhân viên",
          "Thiết bị, hạng mục cần sửa chữa", "Thiết bị đã sửa trong ngày",
          "Món ăn bán chạy trong ngày", "Món lên chậm nhất", "Phản hồi không tốt của KH", "Số bill chênh lệch tạm tính và thanh toán", "CTKM áp dụng trong ngày",
          "Hoạt động offline trong ngày", "Xuất bán đơn khách tiệc", "Số lượng Thành viên tích điểm/ tổng bill",
          "Phát sinh bất thường trong ngày", "Đề xuất",
          "Thời gian CX làm việc đến lv và về", "Thời gian Tổng bar đến lv và về"
        ];
        sheet.appendRow(row2);
        var headerRange = sheet.getRange("A2:X2");
        headerRange.setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true);
        sheet.getRange("A1:A2").merge().setVerticalAlignment("middle").setHorizontalAlignment("center").setFontWeight("bold");
        sheet.getRange("B1:B2").merge().setVerticalAlignment("middle").setHorizontalAlignment("center").setFontWeight("bold");
        sheet.getRange("C1:C2").merge().setVerticalAlignment("middle").setHorizontalAlignment("center").setFontWeight("bold");
        sheet.getRange("D1:D2").merge().setVerticalAlignment("middle").setHorizontalAlignment("center").setFontWeight("bold");
        sheet.getRange("A1:X2").setBorder(true, true, true, true, true, true);
        sheet.setFrozenRows(2);
        sheet.setRowHeight(2, 60);
      }

      row = new Array(24).fill("");
      row[0] = new Date();
      row[1] = data.location || "";
      row[2] = data.date || "";
      row[3] = data.reporter || "";

      var itemsVH = data.items || [];
      itemsVH.forEach(function(item) {
        var cleanVal = (item.value !== undefined && item.value !== null) ? item.value.toString().trim() : "";
        if (!cleanVal || cleanVal === "Không có dữ liệu phát sinh") return;

        if (item.id >= 1 && item.id <= 20) {
          row[item.id + 3] = cleanVal;
          return;
        }

        var title = (item.title || "").toLowerCase();
        if (title.indexOf("nhân viên mới") !== -1) row[4] = cleanVal;
        else if (title.indexOf("nghỉ việc") !== -1) row[5] = cleanVal;
        else if (title.indexOf("số lượng nhân viên làm") !== -1 || title.indexOf("nhân viên làm") !== -1) row[6] = cleanVal;
        else if (title.indexOf("vi phạm") !== -1) row[7] = cleanVal;
        else if (title.indexOf("ngủ tại ch") !== -1 || title.indexOf("ngủ") !== -1) row[8] = cleanVal;
        else if (title.indexOf("đào tạo") !== -1) row[9] = cleanVal;
        else if (title.indexOf("cần sửa chữa") !== -1 || title.indexOf("cần sửa") !== -1) row[10] = cleanVal;
        else if (title.indexOf("đã sửa") !== -1) row[11] = cleanVal;
        else if (title.indexOf("bán chạy") !== -1) row[12] = cleanVal;
        else if (title.indexOf("lên chậm") !== -1) row[13] = cleanVal;
        else if (title.indexOf("phản hồi không tốt") !== -1 || title.indexOf("không tốt") !== -1) row[14] = cleanVal;
        else if (title.indexOf("chênh lệch") !== -1 || title.indexOf("tạm tính") !== -1) row[15] = cleanVal;
        else if (title.indexOf("ctkm") !== -1 || title.indexOf("khuyến mại") !== -1) row[16] = cleanVal;
        else if (title.indexOf("hoạt động offline") !== -1 || title.indexOf("offline") !== -1) row[17] = cleanVal;
        else if (title.indexOf("xuất bán") !== -1 || title.indexOf("khách tiệc") !== -1) row[18] = cleanVal;
        else if (title.indexOf("tích điểm") !== -1 || title.indexOf("thành viên") !== -1) row[19] = cleanVal;
        else if (title.indexOf("bất thường") !== -1) row[20] = cleanVal;
        else if (title.indexOf("đề xuất") !== -1) row[21] = cleanVal;
        else if (title.indexOf("thời gian cx") !== -1 || title.indexOf("cx") !== -1) row[22] = cleanVal;
        else if (title.indexOf("thời gian tổng bar") !== -1 || title.indexOf("tổng bar") !== -1) row[23] = cleanVal;
      });
    }

    // Ghi dữ liệu dòng mới vào bảng tính nếu có
    if (row && row.length > 0) {
      sheet.appendRow(row);

      if (sheetName === "BC Vận hành" || sheetName === "BC vận hành") {
        var lastRow = sheet.getLastRow();
        sheet.getRange(lastRow, 1, 1, row.length)
             .setBorder(true, true, true, true, true, true)
             .setVerticalAlignment("middle")
             .setWrap(true);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// =============================================================================
// CÁC HÀM HỖ TRỢ CHO BÁO CÁO TỒN & ĐẶT HÀNG BAR ("BC Tồn Đặt Bar" & "TH Bar")
// =============================================================================

function ensureTonDatRecordSheet_(ss) {
  var sheet = ss.getSheetByName(TON_DAT_RECORD_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(TON_DAT_RECORD_SHEET);
  }
  if (sheet.getLastRow() === 0) {
    var row1 = ["Thời gian gửi", "Ngày", "Chi nhánh", "Tên NV Bar", "Loại"];
    var row2 = ["", "", "", "", ""];
    TON_DAT_UNIT_DEFS.forEach(function(u) {
      row1.push(u.product);
      row2.push(u.unit);
    });
    sheet.appendRow(row1);
    sheet.appendRow(row2);

    for (var c = 1; c <= 5; c++) {
      sheet.getRange(1, c, 2, 1).merge();
    }
    var colIdx = 6;
    while (colIdx <= 5 + TON_DAT_UNIT_DEFS.length) {
      if (colIdx + 1 <= 5 + TON_DAT_UNIT_DEFS.length && TON_DAT_UNIT_DEFS[colIdx - 6].product === TON_DAT_UNIT_DEFS[colIdx - 5].product) {
        sheet.getRange(1, colIdx, 1, 2).merge();
        colIdx += 2;
      } else {
        colIdx += 1;
      }
    }
    sheet.getRange(1, 1, 2, 5 + TON_DAT_UNIT_DEFS.length)
      .setFontWeight("bold")
      .setBackground("#f1f5f9")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setBorder(true, true, true, true, true, true, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID);
    sheet.setFrozenRows(2);
  }
  return sheet;
}

function readLatestTonDatForDate_(targetDateStr) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TON_DAT_RECORD_SHEET);
  var branches = {};

  TON_DAT_STORES.forEach(function(code) {
    branches[code] = { staffName: "", ton: {}, dat: {}, updatedAt: "" };
  });

  if (!sheet || sheet.getLastRow() <= 2) {
    return { status: "success", date: targetDateStr, branches: branches, recordCount: 0 };
  }

  var lastRow = sheet.getLastRow();
  var totalCols = 5 + TON_DAT_UNIT_DEFS.length;
  var values = sheet.getRange(3, 1, lastRow - 2, totalCols).getValues();
  var matchedRows = 0;

  for (var r = 0; r < values.length; r++) {
    var row = values[r];
    var rowDate = normalizeBarDateStr_(row[1]);
    if (rowDate !== targetDateStr) continue;

    var rawBranch = String(row[2] || "").trim();
    var branchCode = rawBranch === "12B ĐT" || rawBranch === "12BĐT" ? "12 ĐT"
      : (rawBranch === "01 DD" ? "01 ĐD" : rawBranch);
    if (!branches[branchCode]) continue;

    matchedRows++;
    var staffName = String(row[3] || "").trim();
    var kind = String(row[4] || "").trim().toUpperCase();
    var timestamp = row[0] instanceof Date
      ? Utilities.formatDate(row[0], "GMT+7", "HH:mm dd/MM/yyyy")
      : String(row[0] || "");

    if (staffName) {
      branches[branchCode].staffName = staffName;
    }
    branches[branchCode].updatedAt = timestamp;

    var targetKey = kind.indexOf("ĐẶT") !== -1 || kind.indexOf("DAT") !== -1 ? "dat" : "ton";
    TON_DAT_UNIT_DEFS.forEach(function(u, idx) {
      var rawCell = row[5 + idx];
      if (rawCell !== "" && rawCell !== null && rawCell !== undefined) {
        branches[branchCode][targetKey][u.key] = String(rawCell).replace(".", ",");
      } else {
        branches[branchCode][targetKey][u.key] = "";
      }
    });
  }

  return {
    status: "success",
    date: targetDateStr,
    branches: branches,
    recordCount: matchedRows
  };
}

function renderTonDatSummarySheet_(ss, dateStr, branches) {
  var sheet = ss.getSheetByName(TON_DAT_SUMMARY_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(TON_DAT_SUMMARY_SHEET);
  }

  var tz = ss.getSpreadsheetTimeZone() || "GMT+7";
  var parts = dateStr.split("-");
  var fullDateLabel = parts.length === 3 ? (parts[2] + "/" + parts[1] + "/" + parts[0]) : dateStr;
  var totalCols = 1 + TON_DAT_UNIT_DEFS.length + 1; // 24 cột (A -> X)

  var dateCellValue = fullDateLabel;
  if (parts.length === 3) {
    try {
      dateCellValue = Utilities.parseDate(dateStr + " 12:00:00", tz, "yyyy-MM-dd HH:mm:ss");
    } catch (errDate) {
      dateCellValue = fullDateLabel;
    }
  }

  var isInitialized =
    sheet.getLastRow() >= 17 &&
    String(sheet.getRange(1, 1).getValue()).trim() === "NGÀY:" &&
    String(sheet.getRange(2, 1).getValue()).trim() === "Tên hàng";

  if (!isInitialized) {
    sheet.clear();

    var titleRow = ["NGÀY:", dateCellValue, "", "BÁO CÁO TỔNG BAR VỀ TỒN VÀ ĐẶT HÀNG CUỐI NGÀY"];
    while (titleRow.length < totalCols) titleRow.push("");

    var prodRow = ["Tên hàng"];
    var unitRow = ["ĐVT"];
    TON_DAT_UNIT_DEFS.forEach(function(u) {
      prodRow.push(u.product);
      unitRow.push(u.unit);
    });
    prodRow.push("Tên nv bar làm báo cáo của CH");
    unitRow.push("");

    sheet.getRange(1, 1, 3, totalCols).setValues([titleRow, prodRow, unitRow]);

    // Gộp B1:C1 cho ngày dd/MM/yyyy và D1:X1 cho tiêu đề chính
    sheet.getRange(1, 2, 1, 2).merge();
    sheet.getRange(1, 4, 1, totalCols - 3).merge();
    sheet.getRange(1, 1, 1, totalCols).setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
    sheet.getRange(1, 1).setHorizontalAlignment("right");
    sheet.getRange(1, 4, 1, totalCols - 3).setBackground("#fcd5b4").setHorizontalAlignment("left");

    var cIdx = 2;
    while (cIdx <= 1 + TON_DAT_UNIT_DEFS.length) {
      if (cIdx + 1 <= 1 + TON_DAT_UNIT_DEFS.length && TON_DAT_UNIT_DEFS[cIdx - 2].product === TON_DAT_UNIT_DEFS[cIdx - 1].product) {
        sheet.getRange(2, cIdx, 1, 2).merge();
        cIdx += 2;
      } else {
        cIdx += 1;
      }
    }
    sheet.getRange(2, totalCols, 2, 1).merge();
    sheet.getRange(2, 1, 2, totalCols).setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true);
    sheet.getRange(3, 2, 1, TON_DAT_UNIT_DEFS.length).setFontStyle("italic");

    for (var s = 0; s < TON_DAT_STORES.length; s++) {
      var startR = 6 + s * 2;
      sheet.getRange(startR, totalCols, 2, 1).merge();
    }

    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(1);
  }

  // Đảm bảo chiều cao tiêu đề không bị cắt chữ (giữ nguyên độ rộng cột B1:C1 đã gộp)
  sheet.setRowHeight(1, 28);
  sheet.setRowHeight(2, 34);
  sheet.setRowHeight(3, 26);

  // Cập nhật ô B1:C1: mặc định chuẩn dd/MM/yyyy và giữ nguyên định dạng nếu bạn tự chỉnh sửa thêm
  var dateCell = sheet.getRange(1, 2);
  var existingFormat = String(dateCell.getNumberFormat() || "").trim();
  dateCell.setValue(dateCellValue);
  if (dateCellValue instanceof Date) {
    if (!existingFormat || existingFormat.toLowerCase() === "dd/mm" || existingFormat === "0.##########" || existingFormat === "@") {
      dateCell.setNumberFormat("dd/MM/yyyy");
    }
  }
  dateCell.setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  dateCell.setDataValidation(
    SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(true).build()
  );

  // Dòng 4 -> 17: Ghi hàng loạt trong 1 lần để phản hồi tức thì
  var sumTonRow = ["TỔNG TỒN"];
  var sumDatRow = ["TỔNG ĐẶT"];
  for (var i = 0; i < TON_DAT_UNIT_DEFS.length; i++) {
    var colLetter = barColToLetter_(2 + i);
    sumTonRow.push("=SUM(" + colLetter + "6," + colLetter + "8," + colLetter + "10," + colLetter + "12," + colLetter + "14," + colLetter + "16)");
    sumDatRow.push("=SUM(" + colLetter + "7," + colLetter + "9," + colLetter + "11," + colLetter + "13," + colLetter + "15," + colLetter + "17)");
  }
  sumTonRow.push("");
  sumDatRow.push("");

  var bodyRows = [sumTonRow, sumDatRow];
  TON_DAT_STORES.forEach(function(code) {
    var b = branches[code] || { staffName: "", ton: {}, dat: {} };
    var rTon = [code + " - TỒN"];
    var rDat = [code + " - ĐẶT"];
    TON_DAT_UNIT_DEFS.forEach(function(u) {
      rTon.push(parseBarCellVal_(b.ton[u.key]));
      rDat.push(parseBarCellVal_(b.dat[u.key]));
    });
    rTon.push(b.staffName || "");
    rDat.push("");
    bodyRows.push(rTon);
    bodyRows.push(rDat);
  });

  sheet.getRange(4, 1, bodyRows.length, totalCols).setValues(bodyRows);
  sheet.getRange(4, 1, 2, totalCols).setBackground("#ffff00").setFontWeight("bold");
  sheet.getRange(4, 1, bodyRows.length, totalCols).setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.getRange(1, 1, 17, totalCols).setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);
}

function parseThBarDateInput_(val, ss) {
  if (!val) return "";
  var tz = (ss && ss.getSpreadsheetTimeZone()) || "GMT+7";
  if (val instanceof Date && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, tz, "yyyy-MM-dd");
  }
  var s = String(val).trim();
  if (!s) return "";

  // yyyy-MM-dd hoặc yyyy/MM/dd
  var isoMatch = s.match(/^(\\d{4})[\\-\\/](\\d{1,2})[\\-\\/](\\d{1,2})/);
  if (isoMatch) {
    return isoMatch[1] + "-" + padBar2_(isoMatch[2]) + "-" + padBar2_(isoMatch[3]);
  }

  // dd/MM/yyyy hoặc dd-MM-yyyy
  var dmyFull = s.match(/^(\\d{1,2})[\\/\\-](\\d{1,2})[\\/\\-](\\d{4})$/);
  if (dmyFull) {
    return dmyFull[3] + "-" + padBar2_(dmyFull[2]) + "-" + padBar2_(dmyFull[1]);
  }

  // dd/MM hoặc dd-MM (không ghi năm -> ưu tiên năm có record khớp trong BC Tồn Đặt Bar)
  var dmyShort = s.match(/^(\\d{1,2})[\\/\\-](\\d{1,2})$/);
  if (dmyShort) {
    var dd = padBar2_(dmyShort[1]);
    var mm = padBar2_(dmyShort[2]);
    var year = findLatestYearForMonthDay_(ss, mm, dd) || Utilities.formatDate(new Date(), tz, "yyyy");
    return year + "-" + mm + "-" + dd;
  }

  return "";
}

function findLatestYearForMonthDay_(ss, mm, dd) {
  if (!ss) return "";
  var recordSheet = ss.getSheetByName(TON_DAT_RECORD_SHEET);
  if (!recordSheet || recordSheet.getLastRow() <= 2) return "";
  var dateCol = recordSheet.getRange(3, 2, recordSheet.getLastRow() - 2, 1).getValues();
  var suffix = "-" + mm + "-" + dd;
  for (var i = dateCol.length - 1; i >= 0; i--) {
    var dStr = normalizeBarDateStr_(dateCol[i][0]);
    if (dStr.length === 10 && dStr.slice(4) === suffix) {
      return dStr.slice(0, 4);
    }
  }
  return "";
}

function padBar2_(n) {
  var num = Number(n);
  return num < 10 ? "0" + num : String(num);
}

function parseBarCellVal_(val) {
  if (val === undefined || val === null) return "";
  var s = String(val).trim();
  if (!s) return "";
  var num = Number(s.replace(",", "."));
  return !isNaN(num) && isFinite(num) ? num : s;
}

function normalizeBarDateStr_(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tz = (ss && ss.getSpreadsheetTimeZone()) || "GMT+7";
    return Utilities.formatDate(val, tz, "yyyy-MM-dd");
  }
  var s = String(val).trim();
  if (/^\\d{4}-\\d{2}-\\d{2}/.test(s)) return s.substring(0, 10);
  return s;
}

function barColToLetter_(col) {
  var temp = "";
  var letter = "";
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}
`;
