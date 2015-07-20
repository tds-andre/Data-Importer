package data_importer.domain.fields;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.ManyToOne;

@Entity
@Inheritance
@DiscriminatorColumn(name="field_type")
public abstract class Field {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	protected long id;
	
	//@ManyToOne(optional=false)
	//protected Mapping mapping;

}
