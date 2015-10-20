package data_importer.domain.datasets;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class JdbcTable extends Dataset {
	@Column(nullable = true)
	public String driver;
	@Column(nullable = true)
	private String host = "localhost";
	@Column(nullable = true)
	private Integer port;
	@Column(nullable = true)
	private String username;
	@Column(nullable = true)
	private String password;
	@Column(nullable = true)
	public String db;

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
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

	public String getDb() {
		return db;
	}

	public void setDb(String db) {
		this.db = db;
	}

}
