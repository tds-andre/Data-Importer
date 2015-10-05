package etl.flow;

import java.sql.SQLException;

import etl.datasets.CsvDataset;
import etl.datasets.IDataset;
import etl.datasets.MySqlDataset;

public class DatasetCopier extends ManagedThread
{
	public IDataset Target;
	public IDataset Source;
	public EDatasetCopierMode Mode;
	public DatasetCopier(ThreadManager mngr, EDatasetCopierMode mode, IDataset src, IDataset tar) {
		super(mngr);
		Source = src;
		Target = tar;
		Mode = mode;
	}
	
	@Override
	public void execute() throws Exception {
		Target.connect();
		if(Mode==EDatasetCopierMode.CREATE)
			Target.erase();
		if(!Target.exists())
			Target.create(Source.getSchema());
		else if(Mode==EDatasetCopierMode.CLEAR)
			Target.clear();
		if((Source instanceof CsvDataset) && Target instanceof MySqlDataset){
			MySqlDataset tar = (MySqlDataset)Target;
			CsvDataset src = (CsvDataset)Source;
			
			tar.bulkLoadFromCsv(src.getFullLocation());		
		}
	}
	
	
	public void CsvToMysql(CsvDataset source, MySqlDataset target) throws SQLException{
		String query = "load data local "+
				" infile '"+ source.getFullLocation().replace("\\", "/") +
				"' into table "+ target.getLocation() +
				" fields" +
					" terminated by '"+source.getFieldDelimiter()+"'"+
					" enclosed by '\"'"+
				" lines"+
					" terminated by '"+source.getLineDelimiter()+"'"+
					" ignore 1 lines";
		target.getDatabase().query(query);
	}
	
	
	
	
	
	
	
}


