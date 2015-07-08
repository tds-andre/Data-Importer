package data_importer.domain.fields;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class TextField extends Field{
	@Column(name="default_text")
	private String defaultValue;
}
