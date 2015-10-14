package etl.datasets;

public abstract class NumericField<T extends Number> extends AField<Number>{
	protected T Max;
	public T getMax(){return Max;}
	public void setMax(T max){Max = max;}
	protected void fillClone(NumericField clone) throws CloneNotSupportedException{
		super.fillClone(clone);
		clone.setMax(Max);
	}
	
	
}


