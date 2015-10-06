package etl.flow;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;

import etl.databases.LocalFileSystem;
import etl.datasets.CsvDataset;
import etl.datasets.IDataset;
import etl.datasets.MySqlDataset;
import etl.datasets.SolrCore;

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
			
			CsvToMysqlLocal(src, tar);
		}
		else if((Source instanceof CsvDataset) && Target instanceof SolrCore){
			SolrCore tar = (SolrCore)Target;
			CsvDataset src = (CsvDataset)Source;			
			CsvToSolr(src, tar);
		}
	}
	
	
	private void CsvToSolr(CsvDataset src, SolrCore tar) throws FileNotFoundException, IOException {
		CsvDataset tmp = new CsvDataset(new LocalFileSystem(src.getDatabase().getLocation()), src.getLocation() +".tmp");
		//tmp.setSchema(tar.getSchema);
		//src.copyTo(tmp);
			
		
	}

	public void CsvToMysqlLocal(CsvDataset source, MySqlDataset target) throws SQLException{
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


