package data_importer.domain.fields;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Model {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;
	
	@OneToMany(mappedBy="model",targetEntity=Field.class,fetch=FetchType.LAZY)
	private List<Field> fields;
}
