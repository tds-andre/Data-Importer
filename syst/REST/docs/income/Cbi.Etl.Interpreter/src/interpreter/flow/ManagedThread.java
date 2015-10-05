package interpreter.flow;
import interpreter.exceptions.ActionFailureException;
import interpreter.exceptions.NotImplementedMethodException;

import java.sql.SQLException;
import java.util.EventListener;

import javax.swing.event.EventListenerList;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.lang.Thread;

public class ManagedThread extends Thread
{	
	public ThreadManager Manager;
	public EManagedThreadStatus Status;	
	public Boolean HasInterruptionRequest;
	public Boolean HasPauseRequest;
	public EventNotifier Notifier;	
	public ThreadManager Owner;
	public String Message = "";
	public boolean IsPaused = false;
	private Runnable Action = null;
	
	
	
	protected void init(ThreadManager mngr){
		Status = EManagedThreadStatus.IDLE;
		Notifier = new EventNotifier();
		HasInterruptionRequest = false;
		HasPauseRequest = false;
		Manager = mngr; 
	}
	
	public String getMessage(){
		return Message;
	}
	
	public ManagedThread(ThreadManager mngr){
		super();
		init(mngr);		
		
		
	}
	

	public ManagedThread(ThreadManager mngr, Runnable action){
		super();
		init(mngr);		
		Action = action;
		
		
	}
	
	
	
	
	
	private void processEvent(EManagedThreadEvent mte){
		switch(mte){
			case SUCCESS:
				Status = EManagedThreadStatus.COMPLETED;
				Notifier.trigger(mte.toString(), new ActionEvent(this, (int)this.getId(), mte.toString()));				
				break;
			case START:
				Notifier.trigger(mte.toString(), new ActionEvent(this, (int)this.getId(), mte.toString()));
			case RESUME:				
				Status = EManagedThreadStatus.RUNNING;
				Notifier.trigger(EManagedThreadEvent.RESUME.toString(), new ActionEvent(this, (int)this.getId(), EManagedThreadEvent.RESUME.toString()));				
				break;
			case INTERRUPTION:
				Status = EManagedThreadStatus.INTERRUPTED;
				Notifier.trigger(mte.toString(), new ActionEvent(this, (int)this.getId(), mte.toString()));
				break;
			case ERROR:
				Status = EManagedThreadStatus.INTERRUPTED;						
				Notifier.trigger(mte.toString(), new ActionEvent(this, (int)this.getId(), mte.toString()));
				break;
			case PAUSE:
				Status=EManagedThreadStatus.PAUSED;
				Notifier.trigger(mte.toString(), new ActionEvent(this, (int)this.getId(), mte.toString()));				
				break;	
			case FINISH:				
				Notifier.trigger(mte.toString(), new ActionEvent(this, (int)this.getId(), mte.toString()));				
				break;	
				
			
		}
		
	}
		
	
	
	public void requestPause() throws InterruptedException{
		HasPauseRequest = true;
	}
	
	public void play(){
		HasPauseRequest = false;	
		IsPaused = false;
		processEvent(EManagedThreadEvent.RESUME);
		
	}
	protected void pause() throws InterruptedException{
		IsPaused = true;
		processEvent(EManagedThreadEvent.PAUSE);
		while(IsPaused)
			sleep(1000);				
	}	
	
	public void run() {		
		try{			
			processEvent(EManagedThreadEvent.START);
			if(HasPauseRequest)
				pause();
			if(interrupted())
				throw new InterruptedException();
			if(HasPauseRequest){
				pause();
			}
			execute();
			processEvent(EManagedThreadEvent.SUCCESS);
		}
		catch(InterruptedException e){
			processEvent(EManagedThreadEvent.INTERRUPTION);			
		}
		catch(Exception e){
			Message = e.getMessage();
			processEvent(EManagedThreadEvent.ERROR);		
			
		}
		finally{
			processEvent(EManagedThreadEvent.FINISH);
		}
				
	}
	
	protected void execute() throws Exception{
		if(Action!=null)
			Action.run();
		else
			throw new ActionFailureException();
	}	
		
	public void addEventListener(ActionListener evt) {
		addStartListener(evt);
		addResumeListener(evt);
		addPauseListener(evt);
		addInterruptionListener(evt);
		addSuccessListener(evt);
		addErrorListener(evt);		
		addFinishListener(evt);
	}	
	
	public void addStartListener(ActionListener evt){
		Notifier.add(EManagedThreadEvent.START.toString(),evt);
	}
	
	public void addResumeListener(ActionListener evt) {
		Notifier.add(EManagedThreadEvent.RESUME.toString(),evt);
		
	}
	
	public void addInterruptionListener(ActionListener evt) {
		Notifier.add(EManagedThreadEvent.INTERRUPTION.toString(),evt);
	}
	
	public void addErrorListener(ActionListener evt) {
		Notifier.add(EManagedThreadEvent.ERROR.toString(),evt);
	}	
	
	public void addSuccessListener(ActionListener evt){
		Notifier.add(EManagedThreadEvent.SUCCESS.toString(), evt);
	}	
	
	public void addPauseListener(ActionListener evt) {
		Notifier.add(EManagedThreadEvent.PAUSE.toString(),evt);		
	}	
	
	public void addFinishListener(ActionListener evt){
		Notifier.add(EManagedThreadEvent.FINISH.toString(),evt);
		
	}
}

