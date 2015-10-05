package interpreter.datasets;

public class DecimalField extends NumericField<Double> {
	

	public DecimalField(){
		super();
		setMax(Double.MAX_VALUE);
	}

	@Override
	public long getMemorySize() {		
		return Double.SIZE;
	}
	
	

}