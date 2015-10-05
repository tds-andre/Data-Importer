package interpreter.datasets;

public abstract class AField<T> {
	public boolean Nullable = false;
	private T Default;
	private String Name = "Undefined";
	private boolean HasDefault = false;
	public void setNullable(boolean nullable){	
		Nullable = nullable;
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
	
	
	
	
}
