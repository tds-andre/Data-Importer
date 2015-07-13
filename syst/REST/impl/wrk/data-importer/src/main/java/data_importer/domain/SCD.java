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

}
