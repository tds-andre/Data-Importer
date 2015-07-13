package data_importer.domain;

import java.util.Date;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="version_type")
public class Version {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;	
	
	@ManyToOne(optional=false)
	private SCD scd;
	
	private Date createdAt;

}
