package data_importer.domain.datasets;

import javax.persistence.Entity;

@Entity
public class JdbcSelect extends JdbcDataset{	
	private String query;
}
