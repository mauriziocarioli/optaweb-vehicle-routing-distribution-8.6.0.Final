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

package org.optaweb.vehiclerouting.domain;

/**
 * A unique location significant to the user.
 */
public class Location extends LocationData {

    private final long id;

    public Location(long id, Coordinates coordinates, String requiredSkill) {
        super(coordinates, requiredSkill, " ");
        this.id = id;
    }

    public Location(long id, Coordinates coordinates, String requiredSkill, String description) {
        super(coordinates, description, requiredSkill);
        this.id = id;
    }

    /**
     * Location's ID.
     *
     * @return unique ID
     */
    public long id() {
        return id;
    }

    /**
     * Full description of the location including its ID, description and coordinates.
     *
     * @return full description
     */
    public String fullDescription() {
        return "[" + id + "]: " + super.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Location location = (Location) o;
        return id == location.id;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(id);
    }

    @Override
    public String toString() {
        return description().isEmpty() ? Long.toString(id) : (id + ": '" + "'" + requiredSkill() + "'" + description() + "'");
    }
}
