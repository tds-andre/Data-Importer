package data_importer.domain.fields;

import java.math.BigDecimal;

import javax.persistence.Column;

public class CurrencyField extends NumericField implements DefaultValue<BigDecimal> {
	@Column(name="default_currency")
	private BigDecimal defaultValue;

	public BigDecimal getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(BigDecimal defaultValue) {
		this.defaultValue = defaultValue;
	}	

}
