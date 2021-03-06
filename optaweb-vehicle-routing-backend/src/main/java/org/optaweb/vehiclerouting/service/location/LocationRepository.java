/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
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

package org.optaweb.vehiclerouting.service.location;

import java.util.List;
import java.util.Optional;

import org.optaweb.vehiclerouting.domain.Coordinates;
import org.optaweb.vehiclerouting.domain.Location;

/**
 * Defines repository operations on locations.
 */
public interface LocationRepository {

    /**
     * Create a location with a unique ID.
     *
     * @param coordinates location's coordinates
     * @param description description of the location
     * @return a new location
     */
    Location createLocation(Coordinates coordinates, String requiredSkill, String description);

    /**
     * Get all locations.
     *
     * @return all locations
     */
    List<Location> locations();

    /**
     * Remove a location with the given ID.
     *
     * @param id location ID
     * @return the removed location
     */
    Location removeLocation(long id);

    /**
     * Remove all locations from the repository.
     */
    void removeAll();

    /**
     * Find a location by its ID.
     *
     * @param locationId location's ID
     * @return an Optional containing location with the given ID or empty Optional if there is no location with such ID
     */
    Optional<Location> find(long locationId);

}
