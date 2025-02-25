package com.example.graphql;

import com.example.model.CheckIn;
import com.example.repository.CheckInRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@DgsComponent
public class CheckInDataFetcher {

    @Autowired
    private CheckInRepository checkInRepository;

    @DgsQuery
    public CheckIn checkIn(@InputArgument String id) {
        return checkInRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("CheckIn not found"));
    }

    @DgsQuery
    public List<CheckIn> checkInsByUser(@InputArgument String userId) {
        return checkInRepository.findByUserId(Long.parseLong(userId));
    }

    @DgsQuery
    public List<CheckIn> checkInsByManager(@InputArgument String managerId) {
        return checkInRepository.findByManagerId(Long.parseLong(managerId));
    }

    @DgsMutation
    public CheckIn createCheckIn(@InputArgument("input") Map<String, Object> input) {
        CheckIn checkIn = new CheckIn();
        checkIn.setUserId(Long.parseLong((String) input.get("userId")));
        checkIn.setLocationId(Long.parseLong((String) input.get("locationId")));
        checkIn.setStatus((String) input.get("status"));
        checkIn.setTimestamp(java.time.LocalDateTime.now());
        
        return checkInRepository.save(checkIn);
    }

    @DgsMutation
    public CheckIn updateCheckIn(@InputArgument String id, @InputArgument("input") Map<String, Object> input) {
        CheckIn checkIn = checkInRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("CheckIn not found"));
        
        if (input.get("status") != null) {
            checkIn.setStatus((String) input.get("status"));
        }
        
        return checkInRepository.save(checkIn);
    }
}
