package interpreter.datasets;

public abstract class NumericField<T extends Number> extends AField<Number>{
	private T Max;
	public T getMax(){return Max;}
	public void setMax(T max){Max = max;}
	
}


