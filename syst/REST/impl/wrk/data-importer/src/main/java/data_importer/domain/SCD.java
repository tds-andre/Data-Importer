package data_importer.domain;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class SCD<T extends Version> {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;
	
	@OneToMany(mappedBy="scd", targetEntity=Version.class)
	private List<T> versions;
	
	private String name;

	public List<T> getVersions() {
		return versions;
	}

	public void setVersions(List<T> versions) {
		this.versions = versions;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
