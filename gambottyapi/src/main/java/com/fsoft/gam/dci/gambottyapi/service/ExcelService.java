package com.fsoft.gam.dci.gambottyapi.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Set;

import com.fsoft.gam.dci.gambottyapi.domain.MessageUser;
import com.fsoft.gam.dci.gambottyapi.domain.status.MessageUserStatus;
import com.fsoft.gam.dci.gambottyapi.repository.UserRepository;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExcelService {

  @Autowired
  private UserRepository userRepository;

  public ExcelService() {
  }

  private XSSFWorkbook createExcelWorkbook(String[] headers, String sheetName) {
    XSSFWorkbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet(sheetName);

    // Header
    Row headerRow = sheet.createRow(0);
    // Header style
    CellStyle headerStyle = workbook.createCellStyle();
    Font headerFont = workbook.createFont();
    headerFont.setBold(true);
    headerStyle.setFont(headerFont);

    for (int col = 0; col < headers.length; col++) {
      Cell cell = headerRow.createCell(col);
      cell.setCellValue(headers[col]);
      cell.setCellStyle(headerStyle);
    }

    return workbook;
  }

  public ByteArrayInputStream messageUsersToExcel(Set<MessageUser> messageUsers) {
    String[] headers = { "No.", "Account", "Status", "Fail Message" };

    try (Workbook workbook = createExcelWorkbook(headers, "message_users");
        ByteArrayOutputStream out = new ByteArrayOutputStream();) {
      Sheet sheet = workbook.getSheetAt(0);

      // Error message style
      CellStyle style = workbook.createCellStyle();
      Font font = workbook.createFont();
      font.setColor(HSSFColor.HSSFColorPredefined.DARK_RED.getIndex());
      style.setFont(font);

      int rowIdx = 1;
      for (MessageUser messageUser : messageUsers) {
        Row row = sheet.createRow(rowIdx);

        row.createCell(0).setCellValue(rowIdx++);
        row.createCell(1).setCellValue(messageUser.getAccount());
        row.createCell(2).setCellValue(messageUser.getStatus());
        row.createCell(3).setCellValue(messageUser.getFailMessage());
        row.getCell(3).setCellStyle(style);
      }

      workbook.write(out);
      return new ByteArrayInputStream(out.toByteArray());
    } catch (IOException e) {
      throw new RuntimeException("Failed to import data to Excel file: " + e.getMessage());
    }
  }

  // check account exists in user db and export to excel
  public ByteArrayInputStream listRecipientResultToExcel(List<MessageUser> messageUsers) {
    String[] headers = { "No.", "Account", "Status" };

    try (Workbook workbook = createExcelWorkbook(headers, "recipients");
        ByteArrayOutputStream out = new ByteArrayOutputStream();) {
      Sheet sheet = workbook.getSheetAt(0);

      // Error message style
      CellStyle style = workbook.createCellStyle();
      Font font = workbook.createFont();
      font.setColor(HSSFColor.HSSFColorPredefined.DARK_RED.getIndex());
      style.setFont(font);

      boolean hasErrorAccount = false;
      int rowIdx = 1;
      for (MessageUser messageUser : messageUsers) {
        Row row = sheet.createRow(rowIdx);

        row.createCell(0).setCellValue(rowIdx++);
        row.createCell(1).setCellValue(messageUser.getAccount());
        if (!userRepository.existsByAccount(messageUser.getAccount())) {
          row.createCell(2).setCellValue(MessageUserStatus.NOT_FOUND);
          row.getCell(2).setCellStyle(style);
          hasErrorAccount = true;
        }
      }

      // if all account exists return null
      if (!hasErrorAccount) {
        return null;
      }

      workbook.write(out);
      return new ByteArrayInputStream(out.toByteArray());
    } catch (IOException e) {
      throw new RuntimeException("Failed to import data to Excel file: " + e.getMessage());
    }
  }
}
