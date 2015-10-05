package etl.flow;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.EventListener;
import java.util.HashMap;

public class EventNotifier {
	public HashMap<String,ArrayList<ActionListener>> Events;
	public EventNotifier(){
		Events = new HashMap<String, ArrayList<ActionListener>>();
	}
	public void add(String key, ActionListener evt){		
		if(Events.containsKey(key)){
			Events.get(key).add(evt);
		}else{
			Events.put(key, new ArrayList<ActionListener>());
			Events.get(key).add(evt);
		}		
	}
	public void trigger(String key, ActionEvent src){
		ArrayList<ActionListener> evtList = Events.get(key);
		if(evtList!=null)
			for(int i = 0; i< evtList.size(); i++){
				evtList.get(i).actionPerformed(src);
			}
	}

}
