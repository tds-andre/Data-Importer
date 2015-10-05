package etl.datasets;

import java.util.ArrayList;

public class Schema {
	private ArrayList<AField> Fields = new ArrayList<AField>();

	public AField addField(AField field) {
		Fields.add(field);
		return field;
	}
	
	public ArrayList<AField> getFields()
	{
		return Fields;		
	}
	
	public AField getField(int index){
		return Fields.get(index);		
	}
	
	public AField getField(String name){
		for(int i = 0; i < Fields.size(); i++){
			if(Fields.get(i).getName().equals(name))
				return Fields.get(i);
		}
		return null;
	}
	
	public long getMemorySize(){
		int sum = 0;
		for(AField field:Fields){
			sum+= field.getMemorySize();
		}
		return sum;
	}

	
}
