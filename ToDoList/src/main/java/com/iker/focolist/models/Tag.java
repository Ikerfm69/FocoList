package com.iker.focolist.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Tags")
@Data
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(unique = true)
    private String name;


}