package data_importer.domain.datasets;

import javax.persistence.Entity;

import data_importer.domain.servers.SolrServer;

@Entity
public class SolrTable extends Dataset<SolrServer>{
	private String tableName;
}
