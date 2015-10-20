package etl.datasets;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import etl.databases.LocalFileSystem;

public class Xlsx extends ADataset<LocalFileSystem> {
	public void erase() throws Exception {

	}

	public static void xlsToCsv(String inputFilename, String outputFilename,
			String sheetName) {

		File inputFile = new File(inputFilename);
		File outputFile = new File(outputFilename);

		// For storing data into CSV files
		StringBuffer data = new StringBuffer();
		try {
			FileOutputStream fos = new FileOutputStream(outputFile);

			// Get the workbook object for XLS file
			XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(
					inputFile));
			// Get first sheet from the workbook

			XSSFSheet sheet = workbook.getSheet(sheetName);
			Cell cell;
			Row row;

			// Iterate through each rows from first sheet
			Iterator<Row> rowIterator = sheet.iterator();
			while (rowIterator.hasNext()) {
				row = rowIterator.next();
				// For each row, iterate through each columns
				Iterator<Cell> cellIterator = row.cellIterator();
				while (cellIterator.hasNext()) {
					cell = cellIterator.next();

					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_BOOLEAN:
						data.append(cell.getBooleanCellValue() + ";");
						break;

					case Cell.CELL_TYPE_NUMERIC:
						data.append(cell.getNumericCellValue() + ";");
						break;

					case Cell.CELL_TYPE_STRING:
						data.append(cell.getStringCellValue() + ";");
						break;

					case Cell.CELL_TYPE_BLANK:
						data.append("" + ";");
						break;

					default:
						data.append(cell + ";");
					}

				}
				data.append('\n');
			}

			fos.write(data.toString().getBytes());
			fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void xlsToCsv(String inputFilename, String outputFilename,
			Integer sheetIndex) throws IOException {

		File inputFile = new File(inputFilename);
		File outputFile = new File(outputFilename);

		StringBuffer data = new StringBuffer();

		FileOutputStream fos = new FileOutputStream(outputFile);
		// Get the workbook object for XLSX file
		XSSFWorkbook wBook = new XSSFWorkbook(new FileInputStream(inputFile));
		// Get first sheet from the workbook
		XSSFSheet sheet = wBook.getSheetAt(0);
		Row row;
		Cell cell;
		// Iterate through each rows from first sheet
		Iterator<Row> rowIterator = sheet.iterator();

		while (rowIterator.hasNext()) {
			row = rowIterator.next();

			// For each row, iterate through each columns
			Iterator<Cell> cellIterator = row.cellIterator();
			while (cellIterator.hasNext()) {

				cell = cellIterator.next();

				switch (cell.getCellType()) {
				case Cell.CELL_TYPE_BOOLEAN:
					data.append(cell.getBooleanCellValue() + ";");

					break;
				case Cell.CELL_TYPE_NUMERIC:
					data.append(cell.getNumericCellValue() + ";");

					break;
				case Cell.CELL_TYPE_STRING:
					data.append(cell.getStringCellValue() + ";");
					break;

				case Cell.CELL_TYPE_BLANK:
					data.append("" + ";");
					break;
				default:
					data.append(cell + ";");

				}
			}
			data.append("\n");
		}

		fos.write(data.toString().getBytes());
		fos.close();
	}
}
