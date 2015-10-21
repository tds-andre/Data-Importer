package com.maispartners.data_importer.domain.datasets;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class SolrTable extends Dataset {
	@Column(nullable = true)
	private String host = "localhost";
	@Column(nullable = true)
	private Integer port = 80;
	@Column(nullable = true)
	private String username;
	@Column(nullable = true)
	private String password;
	@Column(nullable = true)
	private int ftpPort = 22;
	@Column(nullable = true)
	private String ftpRoot = "/";
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
	public int getFtpPort() {
		return ftpPort;
	}
	public void setFtpPort(int ftpPort) {
		this.ftpPort = ftpPort;
	}
	public String getFtpRoot() {
		return ftpRoot;
	}
	public void setFtpRoot(String ftpRoot) {
		this.ftpRoot = ftpRoot;
	}
	
	
}
