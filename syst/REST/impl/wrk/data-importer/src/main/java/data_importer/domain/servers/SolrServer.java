package data_importer.domain.servers;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;


@Entity
@DiscriminatorValue("SOLR_SERVER")
public class SolrServer extends Server {

}
