package com.maispartners.data_importer.domain.datasets;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToMany;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "specialization")
public abstract class Dataset {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(nullable = true)
	private String location;

	@Column(nullable = true)
	private String name = "Sem nome";

	private boolean previewable = false;

	@OneToMany(cascade = CascadeType.REMOVE, targetEntity = Field.class, mappedBy = "dataset")
	public List<Field> fields;

	public List<Field> getFields() {
		return fields;
	}

	public void setFields(List<Field> fields) {
		this.fields = fields;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getId() {
		return id;
	}

	public boolean isPreviewable() {
		return previewable;
	}

	public void setPreviewable(boolean previewable) {
		this.previewable = previewable;
	}

}
