package interpreter.flow;

import interpreter.datasets.CsvDataset;
import interpreter.datasets.IDataset;
import interpreter.datasets.MySqlDataset;

import java.awt.event.ActionEvent;
import java.sql.SQLException;


/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

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
	
	
	
	
	
	
	
}

