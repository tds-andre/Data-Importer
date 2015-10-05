package interpreter.flow;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.Console;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

public class ThreadManager
{	
	public ArrayList<ManagedThread> Threads;	
	
	public ThreadManager(){
		super();
		Threads = new ArrayList<ManagedThread>();
	}	
	
	public ManagedThread addThread(ManagedThread thread) {		
		Threads.add(thread);
		return thread;
	}
	
	public void startAll() {
		for(int i = 0; i< Threads.size(); i++){
			ManagedThread x = Threads.get(i);			
			x.start();			
		}		
	}
	
	public void joinAll() throws InterruptedException {
		for(int i = 0; i< Threads.size(); i++){
			Threads.get(i).join();
		}		
	}
	
	public void addErrorListener(ActionListener al){
		for(ManagedThread t:Threads)
			t.addErrorListener(al);
	}
	
	
	
	public void addSuccessListener(ActionListener al){
		for(ManagedThread t:Threads)
			t.addSuccessListener(al);
	}
	
	public void addPauseListener(ActionListener al){
		for(ManagedThread t:Threads)
			t.addPauseListener(al);
	}
	
	public void addResumeListener(ActionListener al){
		for(ManagedThread t:Threads)
			t.addResumeListener(al);
	}
	
	public void addFinishListener(ActionListener al){
		for(ManagedThread t:Threads)
			t.addFinishListener(al);
	}	
	
	public void addEventListener(ActionListener al){
		for(ManagedThread t:Threads)
			t.addEventListener(al);
	}
}

