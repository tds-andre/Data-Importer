package etl.datasets;

public class RegexField extends StringField {
	private boolean HasDummy = false;
	private String Dummy = null;
	public boolean hasDummy(){return HasDummy;}
	public void setDummy(String dummy){
		Dummy = dummy;
		setSize(dummy.length());
		HasDummy = true;
	}
	
	public static String matchDummy(String testedValue, String dummy){
		
		
		String result = dummy;
		int diff = testedValue.length() - result.length();
		if(diff>0){
			while(diff>0){
				result = result.concat("a");
				diff--;
			}
		}else if(diff<0){
			char[] cs = result.toCharArray();
			while(diff<0){
				cs[testedValue.length()-1 - diff] = 'a';
				diff++;
			}
			result = cs.toString();
		}
		if(result.startsWith("a"))
			return null;
		char[] cs = result.toCharArray();
		for(int i = 0 ; i < testedValue.length() ; i++){
			boolean breakMe = false;
			switch(cs[i]){
			case 'n':
				try{
					Byte.parseByte(testedValue.substring(i, i+1));
				}
				catch(NumberFormatException e){
					cs[i]='x';
				}
				break;
			case 'a':
				breakMe = true;
			case 'x':
				break;
			default:
				if(cs[i]!=testedValue.charAt(i)){
					try{
						Byte.parseByte(testedValue.substring(i, i+1));
						Byte.parseByte(cs.toString().substring(i,i+1));
					}
					catch(NumberFormatException e){
						cs[i]='x';
					}
				}
			}
			if(breakMe)
				break;
		}
		if(result.startsWith("a"))
			return null;
		return result;
	}
	
	public String getDummy(){
		if(hasDummy())
			return Dummy;
		else
			return "";
	}

}
