package etl.datasets;

public class StringField extends AField<String> {
	public StringField(){
		super();
		setSize(1);		
	}
	private int Size;
	private boolean blobMode = false;
	public int getSize(){return Size;}
	public void setSize(int size){Size = size;}
	
	@Override
	public long getMemorySize() {
		if(blobMode)
			return 2;
		else
			return getSize() * 2;
	}
	public void setBlobMode(boolean b) {
		blobMode = b;
		
	}
	
	public boolean getBlobMode(){
		return blobMode;
	}
}
