package etl.flow;

import java.sql.SQLException;

public abstract class AAction implements Runnable {

	
	private boolean IsSuccessful = false;
	private Exception RunException = null;
	
	protected abstract boolean execute() throws Exception;
	
	public boolean hadException(){
		if(RunException==null)
			return false;
		else
			return true;
	}
	public Exception getException(){
		return RunException;
	}
	
	public void run() {
		try{
			RunException = null;
			IsSuccessful = execute();			
		}catch(Exception e){
			IsSuccessful = false;
			RunException = e;
		}		
	}

	public boolean getIsSuccessful() {		
		return IsSuccessful;
	}

}
