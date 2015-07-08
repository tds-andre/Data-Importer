package data_importer.domain.fields;

import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class NumericField extends Field {
	protected Double min;
	protected Double max;

}
