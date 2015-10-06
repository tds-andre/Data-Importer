package data_importer.domain.datasets;

import javax.persistence.Entity;

import data_importer.domain.servers.JdbcDatabase;
@Entity
public class JdbcTable extends Dataset<JdbcDatabase> {

}
