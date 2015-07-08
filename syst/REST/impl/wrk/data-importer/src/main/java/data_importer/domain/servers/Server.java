package data_importer.domain.servers;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToOne;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="server_type")
public abstract class Server {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)		
	private long id;
	
	@OneToOne
	private ConnectionParameters connection;
}
