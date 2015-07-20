package data_importer.domain.servers;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;


@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@DiscriminatorColumn(name="specialization")
public abstract class Server{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	@Column(nullable=true)
	private String host = "localhost";
	@Column(nullable=true)
	private Integer port;
	@Column(nullable=true)
	private String username;
	@Column(nullable=true)
	private String password;
	@Column(nullable=true)
	private String name = "Sem nome";
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public Integer getPort() {
		return port;
	}
	public void setPort(Integer port) {
		this.port = port;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public long getId() {
		return id;
	}
	
	
}
