package interpreter.datasets;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import interpreter.databases.ADatabase;
import interpreter.databases.IDatabase;
import interpreter.exceptions.NotImplementedMethodException;

import org.apache.commons.csv.*;

public class CsvDataset extends ADataset<ADatabase> {
	
	

	private char FieldDelimiter = ';';
	private String RowDelimiter = "\r\n";
	private char TextEnclosure = '"';
	private char Escape = '"';

	public CsvDataset(IDatabase database, String location) throws FileNotFoundException, IOException {
		super(database, location);		
	}
	
	@Override
	public Schema getSchema() throws Exception{
		if(Schema==null)
			Schema = inferSchema();
		return Schema;		
	}
	
		
	public void setFormat(char fieldDelimiter, String rowDelimiter, char textEnclosure, char escape){		
		FieldDelimiter = fieldDelimiter;
		RowDelimiter = rowDelimiter;
		TextEnclosure = textEnclosure;
		Escape = escape;
	}
	
	public Schema inferSchema() throws Exception {
		Schema result = new Schema();
		CSVFormat format = CSVFormat.DEFAULT
		.withDelimiter(FieldDelimiter)
		.withEscape(Escape)
		.withRecordSeparator(RowDelimiter)
		.withQuote(TextEnclosure);	    
		    
		CSVParser f = CSVParser.parse(new File(getFullLocation()), Charset.defaultCharset(), format);
		
		
		ArrayList<EnumSet<EFieldType>> cols = new ArrayList<EnumSet<EFieldType>>();
		ArrayList<HashMap<EFieldType,AField>> info = new ArrayList<HashMap<EFieldType,AField>>();
		ArrayList<String> names = new ArrayList<String>();
				
		Iterator iter = f.iterator().next().iterator();
		while(iter.hasNext()){			
			names.add((String)iter.next());
			cols.add(EnumSet.allOf(EFieldType.class));
			info.add(new HashMap<EFieldType,AField>());
			HashMap<EFieldType, AField> cur = info.get(info.size()-1);
			for(EFieldType type:EFieldType.values()){
				cur.put(type, type.createInstance());				
			}			
		}
		
		Iterator<CSVRecord> csv = f.iterator();
		while(csv.hasNext()){
			CSVRecord rec = csv.next();			
			int i = -1;			
			for(String value:rec){
				i++;	
				EnumSet<EFieldType> set = cols.get(i);
				if(value.equals("")){
					for(AField field:info.get(i).values())
						field.setNullable(true);
				}
				
				if(set.contains(EFieldType.DECIMAL)){
					try{
						double dblValue = Double.parseDouble(value);						
					}catch (NumberFormatException e){
						set.remove(EFieldType.DECIMAL);
						set.remove(EFieldType.INTEGER);
					}
				}
				if(set.contains(EFieldType.INTEGER)){
					try{						
						long intValue = Long.parseLong(value);
						IntegerField intField = (IntegerField)info.get(i).get(EFieldType.INTEGER); 
						if(intField.getMax()<intValue){
							intField.setMax(intValue);
						}
					}
					catch(NumberFormatException e){set.remove(EFieldType.INTEGER);}				   
				}
				if(set.contains(EFieldType.REGEX)){
					/*RegexField regField = (RegexField)info.get(i).get(FieldType.REGEX);
					String newDummy = value;
					if(regField.hasDummy())
						newDummy = RegexField.matchDummy(newDummy, regField.getDummy());
					else
						regField.setDummy(newDummy);
					if(newDummy==null){*/
						set.remove(EFieldType.REGEX);						
					/*}else
						regField.setDummy(newDummy);*/
				}
				if(set.contains(EFieldType.DATETIME)){
					//(DatetimeField.inferDatepattern(value)==null)
						set.remove(EFieldType.DATETIME);
				}
				if(set.contains(EFieldType.STRING)){
					StringField strField = (StringField)info.get(i).get(EFieldType.STRING);
					if(value.length()>strField.getSize())
						strField.setSize(value.length());
				}
						
			}
		}
		for(int i = 0; i < cols.size(); i++){
			AField field;
			if(cols.get(i).contains(EFieldType.INTEGER))				
				result.addField(info.get(i).get(EFieldType.INTEGER)).setName(names.get(i));
			else if(cols.get(i).contains(EFieldType.DECIMAL))
				result.addField(info.get(i).get(EFieldType.DECIMAL)).setName(names.get(i));
			else if(cols.get(i).contains(EFieldType.DATETIME))
				result.addField(info.get(i).get(EFieldType.DATETIME)).setName(names.get(i));
			else if(cols.get(i).contains(EFieldType.STRING))
				result.addField(info.get(i).get(EFieldType.STRING)).setName(names.get(i));
		}
			
		return result;
		
		
	}

	

}

 