package data_importer.domain.datasets;

import javax.persistence.Entity;
import javax.persistence.Table;


@Entity
public class JdbcTable extends JdbcDataset {
	private String tableName;
}
