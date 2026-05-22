package com.iker.focolist.dtos;

import lombok.Data;

@Data
public class TaskStats {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private double completionPercentage;
}
