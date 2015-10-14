package etl.datasets;

public class IntegerField extends NumericField<Long> {
	
	

	public IntegerField(){
		super();
		setMax((long)Short.MAX_VALUE);
	}

	@Override
	public long getMemorySize() {
		return Long.SIZE;
	}
	
	@Override
	public IntegerField clone() throws CloneNotSupportedException{
		IntegerField clone  = new IntegerField();
		fillClone(clone);
		return clone;
		
	}
	
	
}
