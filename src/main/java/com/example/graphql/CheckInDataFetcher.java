package com.example.graphql;

import com.example.model.Checkin;
import com.example.repository.*;
import com.netflix.graphql.dgs.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@DgsComponent
public class CheckInDataFetcher {

    @Autowired
    private CheckInRepository checkInRepository;

    @DgsQuery
    public Checkin checkIn(@InputArgument String id) {
        return checkInRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("CheckIn not found"));
    }

    @DgsQuery
    public List<Checkin> checkInsByUser(@InputArgument String userId) {
        return checkInRepository.findByUserId(Long.parseLong(userId));
    }

    @DgsQuery
    public List<Checkin> checkInsByManager(@InputArgument String managerId) {
        return checkInRepository.findByManagerId(Long.parseLong(managerId));
    }

   /* @DgsMutation
    public Checkin createCheckIn(@InputArgument("input") Map<String, Object> input) {
        Checkin checkIn = new Checkin();
        checkIn.setId(Long.parseLong((String) input.get("userId")));
        checkIn.setLocationId(Long.parseLong((String) input.get("locationId")));
        checkIn.setStatus((String) input.get("status"));
        checkIn.setTimestamp(java.time.LocalDateTime.now());

        return checkInRepository.save(checkIn);
    }*/

    @DgsMutation
    public Checkin updateCheckIn(@InputArgument String id, @InputArgument("input") Map<String, Object> input) {
        Checkin checkIn = checkInRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("CheckIn not found"));
        
        /*if (input.get("status") != null) {
            checkIn.setStatus((String) input.get("status"));
        }*/
        
        return checkInRepository.save(checkIn);
    }
}
