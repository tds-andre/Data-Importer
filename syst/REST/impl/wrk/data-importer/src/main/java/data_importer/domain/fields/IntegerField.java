package data_importer.domain.fields;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class IntegerField extends NumericField implements DefaultValue<Integer>{
	@Column(name="default_integer")
	private Integer defaultValue;	

	public Integer getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(Integer defaultValue) {
		this.defaultValue = defaultValue;
	}

}
