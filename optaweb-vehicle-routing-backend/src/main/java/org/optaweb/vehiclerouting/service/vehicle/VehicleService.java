/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.optaweb.vehiclerouting.service.vehicle;

import static java.util.Comparator.comparingLong;

import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;

import org.optaweb.vehiclerouting.domain.Vehicle;
import org.optaweb.vehiclerouting.domain.VehicleData;

@ApplicationScoped
public class VehicleService {

    static final int DEFAULT_VEHICLE_CAPACITY = 10;

    private final VehiclePlanner planner;
    private final VehicleRepository vehicleRepository;

    @Inject
    public VehicleService(VehiclePlanner planner, VehicleRepository vehicleRepository) {
        this.planner = planner;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public Vehicle createVehicle() {
        HashSet<String> skillset = new HashSet<String>();
        skillset.add("depot");
        Vehicle vehicle = vehicleRepository.createVehicle(DEFAULT_VEHICLE_CAPACITY, skillset);
        addVehicle(vehicle);
        return vehicle;
    }

    @Transactional
    public Vehicle createVehicle(VehicleData vehicleData) {
        Vehicle vehicle = vehicleRepository.createVehicle(vehicleData);
        addVehicle(vehicle);
        return vehicle;
    }

    public void addVehicle(Vehicle vehicle) {
        planner.addVehicle(Objects.requireNonNull(vehicle));
    }

    @Transactional
    public void removeVehicle(long vehicleId) {
        Vehicle vehicle = vehicleRepository.removeVehicle(vehicleId);
        planner.removeVehicle(vehicle);
    }

    public synchronized void removeAnyVehicle() {
        Optional<Vehicle> first = vehicleRepository.vehicles().stream().min(comparingLong(Vehicle::id));
        first.map(Vehicle::id).ifPresent(this::removeVehicle);
    }

    @Transactional
    public void removeAll() {
        planner.removeAllVehicles();
        vehicleRepository.removeAll();
    }

    @Transactional
    public void changeCapacity(long vehicleId, int capacity) {
        Vehicle updatedVehicle = vehicleRepository.changeCapacity(vehicleId, capacity);
        planner.changeCapacity(updatedVehicle);
    }
}
