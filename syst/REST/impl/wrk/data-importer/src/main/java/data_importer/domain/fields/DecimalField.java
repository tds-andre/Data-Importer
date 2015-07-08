package data_importer.domain.fields;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class DecimalField extends NumericField implements DefaultValue<Double>{
	@Column(name="default_double")
	private Double defaultValue;

	public Double getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(Double defaultValue) {
		this.defaultValue = defaultValue;
	}	

}
