package data_importer.domain.datasets;

import javax.persistence.Entity;
import javax.persistence.MappedSuperclass;

import data_importer.domain.servers.JdbcServer;

@MappedSuperclass
public class JdbcDataset extends Dataset<JdbcServer>{

}
