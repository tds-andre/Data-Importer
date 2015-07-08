package data_importer.domain.fields;

public interface DefaultValue<T> {
	public T getDefaultValue();
	public void setDefaultValue(T val);
}
