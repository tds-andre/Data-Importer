package interpreter.flow;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import etl.databases.JdbcDatabase;
import etl.flow.AAction;

public class SqlStatementsExecutor extends AAction
{
	public enum ETransactionMode {
		GLOBAL, COMMIT, PRIVATE;

		}

	public ArrayList<String> Statements = new ArrayList<String>();
	public JdbcDatabase Database;	
	public ETransactionMode TransactionMode = ETransactionMode.GLOBAL;
	
	
	public void setTransactionMode(ETransactionMode mode){
		if(mode!=null)
			TransactionMode = mode;
	}
	public SqlStatementsExecutor(JdbcDatabase database, String stmts, ETransactionMode mode){
		super();
		addStatements(stmts);
		Database = database;
		if(mode!=null)
			TransactionMode = mode;		
	}
	public void addStatement(String stmt){
		Statements.add(stmt.trim());		
	}
	public void addStatements(String stmts){
		
		String[] ss = stmts.trim().split(";\\r?\\n");
		for(int i = 0; i < ss.length; i++)
			addStatement(ss[i]);		
	}
	
	public boolean execute() throws ClassNotFoundException, SQLException{
		Connection conn;
		if(TransactionMode == ETransactionMode.PRIVATE){
			conn = Database.getNewConnection();
			conn.setAutoCommit(false);
		}else
			conn = Database.getConnection();
		try{
			for(int i = 0; i < Statements.size(); i++)
				JdbcDatabase.query(Statements.get(i),conn);
			if(TransactionMode ==ETransactionMode.COMMIT||TransactionMode==ETransactionMode.PRIVATE)
				conn.commit();
		}catch(SQLException e){
			if(TransactionMode == ETransactionMode.PRIVATE)
				conn.rollback();
			throw e;
		}			
		return true;
	}
		
	
}

