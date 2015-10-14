package etl.datasets;

public abstract class AField<T> {
	public boolean Nullable = false;
	private T Default;
	private String Name = "Undefined";
	private boolean HasDefault = false;
	public void setNullable(boolean nullable){	
		Nullable = nullable;
	}
	public boolean getNullable(){	
		return Nullable;
	}
	
	
	public void setDefault(T def){		
		Default = def;
		HasDefault = true;
	}
	public T getDefault(){
		return Default;
	}
	public String getName(){
		return Name;
	}
	public void setName(String name){
		Name = name;
		
	}
	public boolean getHasDefault(){
		return HasDefault;
	}
	
	public abstract long getMemorySize();
	
	protected void fillClone(AField clone) throws CloneNotSupportedException{
		clone.setDefault(this.getDefault());
		clone.setName(this.getName());
		clone.setNullable(this.getNullable());		
	}
	
	protected AField<T> clone() throws CloneNotSupportedException{
		return null;
		
	}
	
	
	
	
}
