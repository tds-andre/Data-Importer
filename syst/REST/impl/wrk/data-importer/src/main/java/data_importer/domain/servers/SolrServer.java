package data_importer.domain.servers;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;


@Entity
@DiscriminatorValue("SOLR_SERVER")
public class SolrServer extends Server {
	private int ftpPort = 22;
	
	

	public int getFtpPort() {
		return ftpPort;
	}

	public void setFtpPort(int ftpPort) {
		this.ftpPort = ftpPort;
	}

	
	
}
