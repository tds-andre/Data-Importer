package data_importer.domain.servers;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("LOCAL_SERVER")
public class LocalServer extends FileServer{

}
